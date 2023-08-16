function get_color_coded_neurons (number_of_layers) {
	var colors = [
		{ "number": 1000, "color": "red" },
		{ "number": 100, "color": "yellow" },
		{ "number": 10, "color": "blue" }
	];

	var left = number_of_layers;

	var results = [];

	for (var i = 0; i < colors.length; i++) {
		var number = colors[i]["number"];
		var color = colors[i]["color"];

		while (left > number) {
			results.push(color);
			left = left - number;
		}
	}

	for (var i = 0; i < left; i++) {
		results.push("white");
	}

	return results;
}

var get_methods = (obj) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function')
var local_store = window.localStorage;
local_store.clear();

var old_mode = "beginner";

function get_mode() {
	var mode = $("#mode_chooser > input[type=radio]:checked").val();
	if(mode != old_mode && (state_stack.length > 1 || future_state_stack.length)) {
		state_stack = [];
		future_state_stack = [];

		show_hide_undo_buttons();
		Swal.fire(
			language[lang]["undo_redo_stack_lost"],
			language[lang]["changing_mode_deletes_stack"],
			'warning'
		);
		l("Changed mode " + old_mode + " to " + mode + ", lost undo/redo stack");
	} else {
		if(mode != old_mode) {
			l("Changed mode " + old_mode + " to " + mode);
		}
	}

	if(old_mode != mode) {
		setCookie("mode", mode);
	}

	return mode;
}


function set_mode () {
	mode = get_mode();
	setCookie("mode", mode);
	if(mode == "beginner") {
		throw_compile_exception = false;
		$(".layer_type").children().children().each(function (t, l) {
			if(!$(l).is(":checked")) {
				$(l).attr("disabled", true);
			}
		});
		$("#auto_input_shape").prop('checked', true);
		$(".expert_mode_only").hide();
		l("Auto input shape is only available on Expert Mode");
	} else {
		throw_compile_exception = true;
		$(".expert_mode_only").show();
	}

	disable_everything_in_last_layer_enable_everyone_else_in_beginner_mode();
}

var clicked_on_tab = 0;

var currentLayer = 0;

var seed_two = 1;
function random_two(min, max) { // Seeded PRNG
	var x = Math.sin(seed_two++) * 10000;
	result = x - Math.floor(x);
	result = ((max - min) * result) + min;
	return result;
}



var seed = 1;
function random(min, max) { // Seeded PRNG
	var x = Math.sin(seed++) * 10000;
	result = x - Math.floor(x);
	result = ((max - min) * result) + min;
	return result;
}

function get_units_at_layer(i, use_max_layer_size) {
	var units = undefined;
	try {
		var units = get_item_value(i, "units");
		if(units) {
			units = parseInt(units);
		} else {
			if(model === null) {
				units = 0;
			} else {
				var filters = $($(".layer_setting")[i]).find(".filters");
				if(filters.length) {
					units = parseInt($(filters).val());
				} else {
					try {
						units = Math.max(0, model.layers[i].countParams());
					} catch (e) {
						console.warn("Something went wrong when trying to determine get_units_at_layer");
					}
				}
			}
		}
	} catch (e) {
		log(e);
	}

	var max_neurons_fcnn = parseInt($("#max_neurons_fcnn").val());

	if(units > max_neurons_fcnn && use_max_layer_size) {
		l("FCNN-Visualization: Units is " + units + ", which is bigger than " + max_neurons_fcnn + ". " + max_neurons_fcnn + " is the maximum, it will get set to this for layer " + i);
		units = max_neurons_fcnn;
	}

	return units;
}

function scale_down (max_value, architecture) {
	var relations = [];
	var new_architecture = [];
	for (var i = 0; i < architecture.length; i++) {
		var item = architecture[i];
		if(item <= max_value) {
			relations.push(0);
		} else {
			relations.push(item / max_value);
		}
	}

	for (var i = 0; i < architecture.length; i++) {
		var item = architecture[i];
		var relation = relations[i];

		if(relation) {
			new_architecture.push(max_value + Math.ceil(relation));
		} else {
			new_architecture.push(item);
		}

	}

	return new_architecture;
}

var fcnn = FCNN();

async function restart_fcnn(force) {
	if(!model) {
		log("FCNN: No model");
		return;
	}

	if(force) {
		graph_hashes["fcnn"] = "";
	}

	var architecture = [];
	var real_architecture = [];
	var betweenNodesInLayer = [];
	var layer_types = [];

	if(show_input_layer) {
		layer_types.push("Input layer");
		if(Object.keys(model.layers).includes("0")) {
			try {
				var input_layer = Object.values(remove_empty(model.layers[0].input.shape));
				architecture.push(input_layer[0]);
				real_architecture.push(input_layer[0]);
				betweenNodesInLayer.push(10);
			} catch (e) {
				console.error(e);
				return;
			}
		} else {
			console.warn("Model has no first layer. Returning from restart_fcnn");
		}
	}

	for (var i = 0; i < get_number_of_layers(); i++) {
		var number_of_units = get_units_at_layer(i, 1);
		var layer_type = $($(".layer_type")[i]).val();
		if(parseInt(number_of_units) > 0) {
			real_architecture.push(number_of_units);
			if(number_of_units > 100) {
				number_of_units = 100;
			}
			architecture.push(number_of_units);
			betweenNodesInLayer.push(10);
			layer_types.push(layer_type);
		}
	}

	var redraw_data = {
		'architecture_': architecture, 
		'real_architecture_': real_architecture, 
		'layerTypes_': layer_types,
		'colors_': []
	};

	var redistribute_data = {
		'betweenNodesInLayer_': betweenNodesInLayer
	};
	var new_hash = await md5(JSON.stringify(redraw_data) + JSON.stringify(redistribute_data));

	if(graph_hashes["fcnn"] != new_hash) {
		if(architecture.length + real_architecture.length) {
			fcnn.redraw(redraw_data);
			fcnn.redistribute(redistribute_data);
			graph_hashes["fcnn"] = new_hash;
		} else {
			log("invalid architecture lengths");
		}
	}
	reset_view();
}

var disable_alexnet = 0;

var alexnet = AlexNet();
async function restart_alexnet(dont_click) {
	seed = 1;
	var architecture = [];
	var architecture2 = [];
	var colors = [];

	disable_alexnet = 0;

	for (var i = 0; i < get_number_of_layers(); i++) {
		if(disable_alexnet) { continue; }
		var layer_type = $($(".layer_type")[i]).val();
		if(typeof(layer_type) === 'undefined') {
			return;
		}
		if(Object.keys(model.layers).includes("0")) {
			if(layer_type in layer_options && Object.keys(layer_options[layer_type]).includes("category")) {
				var category = layer_options[layer_type].category;

				if(category == "Convolutional") {
					var this_layer_arch = {};
					try {
						var input_layer_shape = model.layers[i].getOutputAt(0).shape;

						var push = 0;

						try {
							this_layer_arch["height"] = input_layer_shape[1];
							this_layer_arch["width"] = input_layer_shape[2];
							if(input_layer_shape.length >= 2) {
								this_layer_arch["depth"] = input_layer_shape[3];
							} else {
								disable_alexnet = 1;
							}
							this_layer_arch["filterWidth"] = parseInt(get_item_value(i, "kernel_size_x"));
							this_layer_arch["filterHeight"] = parseInt(get_item_value(i, "kernel_size_y"));
							this_layer_arch["rel_x"] = random(0, 0.1);
							this_layer_arch["rel_y"] = random(0, 0.1);

							if(this_layer_arch["filterWidth"] && this_layer_arch["filterHeight"] && this_layer_arch["depth"]) {
								push = 1;
							}
						} catch (e) {
							console.warn("ERROR: ", e);
						}
					} catch (e) {
						console.log(e);
						return;
					}

					if(push) {
						architecture.push(this_layer_arch);
					}
				} else if (category == "Basic") {
					try {
						var units_at_layer = get_units_at_layer(i, 0);
						if(units_at_layer) {
							architecture2.push(units_at_layer);
						}
					} catch (e) {
						log(e);
						return;
					}
				}
			} else {
				log("Cannot get category of layer type of layer " + i);
				return;
			}
		} else {
			if(finished_loading) {
				console.warn("Model has no first layer. Skipping restart_alexnet");
			}
		}
	}

	if(!disable_alexnet) {
		try {
			if(architecture.length && architecture2.length) {
				try {
					if(show_input_layer) {
						var shown_input_layer = {};
						var input_shape = get_input_shape();
						shown_input_layer["height"] = input_shape[0];
						shown_input_layer["width"] = input_shape[1];
						if(input_shape.length >= 3) {
							shown_input_layer["depth"] = input_shape[2];
						} else {
							disable_alexnet = 1;
						}
						shown_input_layer["filterWidth"] = 1;
						shown_input_layer["filterHeight"] = 1;
						shown_input_layer["rel_x"] = random(-0.1,0.1);
						shown_input_layer["rel_y"] = random(-0.1,0.1);

						architecture.unshift(shown_input_layer);
					}

					var redraw_data = {'architecture_': architecture, 'architecture2_': architecture2, "showDims": true};

					var new_hash = await md5(JSON.stringify(redraw_data));

					if(graph_hashes["alexnet"] != new_hash) {
						alexnet.restartRenderer(1);
						alexnet.redraw(redraw_data);
						graph_hashes["alexnet"] = new_hash;
					}
				} catch (e) {
					console.warn(e);
					disable_alexnet = 1;
				}
			} else {
				disable_alexnet = 1;
			}
		} catch (e) {
			console.warn(e);
			disable_alexnet = 1;
		}
	}

	if(disable_alexnet) {
		if(!is_cosmo_mode) {
			hide_tab_label("alexnet_tab_label");
			if(!dont_click) {
				if(clicked_on_tab == 0) {
					show_tab_label("fcnn_tab_label", click_on_graphs);
					clicked_on_tab = 1
				}
			}
		}
	} else {
		if(!is_cosmo_mode) {
			show_tab_label("alexnet_tab_label", 0);
			if(!dont_click) {
				if(clicked_on_tab == 0) {
					show_tab_label('alexnet_tab_label', click_on_graphs);
					clicked_on_tab = 1;
				}
			}
		}
	}
	reset_view();

	conv_visualizations["alexnet"] = !disable_alexnet;
}

var lenet = LeNet();

async function restart_lenet(dont_click) {
	var layer_to_lenet_arch = {};
	architecture = [];
	architecture2 = [];
	colors = [];

	var j = 0;
	if(!show_input_layer) {
		j--;
	}

	for (var i = 0; i < get_number_of_layers(); i++) {
		var layer_type = $($(".layer_type")[i]).val();
		if(typeof(layer_type) === 'undefined') {
			return;
		}

		if(Object.keys(model.layers).includes("0")) {
			if(layer_type in layer_options && Object.keys(layer_options[layer_type]).includes("category")) {
				var category = layer_options[layer_type]["category"];

				if((category == "Convolutional" || category == "Pooling") && layer_type.endsWith("2d") && layer_type.startsWith("conv")) {
					try {
						var this_layer_arch = {};
						this_layer_arch["op"] = layer_type;
						this_layer_arch["layer"] = ++j;

						var layer_config = model.layers[i].getConfig();
						var push = 0;
						if("filters" in layer_config) {
							this_layer_arch["filterWidth"] = get_item_value(i, "kernel_size_x");
							this_layer_arch["filterHeight"] = get_item_value(i, "kernel_size_y");
							this_layer_arch["numberOfSquares"] = layer_config["filters"];
							push = 1;
						} else if("poolSize" in layer_config) {
							var output_size_this_layer = await output_size_at_layer(get_input_shape(), i);
							this_layer_arch["filterWidth"] = get_item_value(i, "pool_size_x");
							this_layer_arch["filterHeight"] = get_item_value(i, "pool_size_y");
							this_layer_arch["numberOfSquares"] = output_size_this_layer[3];
							push = 1;
						}

						var input_layer = model.layers[i].getInputAt(0);
						this_layer_arch["squareWidth"] = input_layer["shape"][1];
						this_layer_arch["squareHeight"] = input_layer["shape"][2];

						if(push) {
							architecture.push(this_layer_arch);
							layer_to_lenet_arch[i] = {arch: "architecture", "id": architecture.length - 1};
							colors.push("#ffffff");
						}
					} catch (e) {
						console.error(e);
					}
				} else if (category == "Basic") {
					try {
						var units_at_layer = get_units_at_layer(i, 0);
						if(units_at_layer) {
							architecture2.push(units_at_layer);
							layer_to_lenet_arch[i] = {"arch": "architecture2", "id": architecture.length - 1};
						}
					} catch (e) {
						return;
					}
				}

			} else {
				log("Cannot get category of layer type of layer " + i);
				return;
			}
		} else {
			console.warn("Model has no first layer. Returning from restart_lenet");
		}
	}

	var disable_lenet = 0;

	try {
		if(architecture.length >= 1 && architecture2.length) {
			if(show_input_layer) {
				var shown_input_layer = {}
				shown_input_layer["op"] = "Input Layer";
				shown_input_layer["layer"] = 0;
				shown_input_layer["filterWidth"] = get_input_shape()[0];
				shown_input_layer["filterHeight"] = get_input_shape()[1];
				shown_input_layer["numberOfSquares"] = 1;
				shown_input_layer["squareWidth"] = get_input_shape()[0];
				shown_input_layer["squareHeight"] = get_input_shape()[1];
				architecture.unshift(shown_input_layer);
			}

			try {
				var redraw_data = {'architecture_': architecture, 'architecture2_': architecture2, 'colors': colors};
				var new_hash = await md5(JSON.stringify(redraw_data));
				if(graph_hashes["lenet"] != new_hash) {
					lenet.redraw(redraw_data);
					lenet.redistribute({'betweenLayers_': []});
					graph_hashes["lenet"] = new_hash;
				}
			} catch (e) {
				log(e);
			}
		} else {
			disable_lenet = 1;
		}
	} catch (e) {
		log("ERROR: ");
		log(e);
		disable_lenet = 2;
	}

	if(disable_lenet) {
		if(!is_cosmo_mode) {
			hide_tab_label("lenet_tab_label");
			if(clicked_on_tab == 0) {
				if(!dont_click) {
					show_tab_label("fcnn_tab_label", click_on_graphs);
					clicked_on_tab = 1;
				}
			}
		}
	} else {
		if(!is_cosmo_mode) {
			show_tab_label("lenet_tab_label", 0);
			if(clicked_on_tab == 0) {
				if(!dont_click) {
					show_tab_label("lenet_tab_label", click_on_graphs);
					clicked_on_tab = 1;
				}
			}
		}
	}

	reset_view();
	conv_visualizations["lenet"] = !disable_lenet;
}



function unset_alexnet_renderer () {
	var renderers = $("#alexnet_renderer > input[type=radio]");
	for (var i = 0; i < renderers.length; i++) {
		$(renderers[i]).prop("checked", false)
	}
}

function set_specific_alexnet_renderer(var_type) {
	unset_alexnet_renderer();
	var renderers = $("#alexnet_renderer > input[type=radio]");
	for (var i = 0; i < renderers.length; i++) {
		if($(renderers[i]).val() == var_type) {
			$(renderers[i]).prop("checked", true);
		}else {
			$(renderers[i]).prop("checked", false);
		}
	}
	restart_alexnet()
}

function download_visualization (layer_id) {
	var old_alexnet_renderer = $("#alexnet_renderer > input[type=radio]:checked").val();
	if(layer_id == "alexnet") {
		set_specific_alexnet_renderer("svg");
		restart_alexnet()
	}
	var content = $('<div>').append($($("#" + layer_id).html()).attr("xmlns", "http://www.w3.org/2000/svg") ).html();
	if(layer_id == "alexnet") {
		var canvas = $($("#alexnet")[0]).children()[0];
		content = canvas.toDataURL();
	}
				

	var data_url = 'data:application/octet-stream;base64,' + btoa(unescape(encodeURIComponent(content)))
	var a = document.createElement("a");
	a.href = data_url;
	a.download = layer_id + ".svg";
	a.click();
	if(layer_id == "alexnet") {
		set_specific_alexnet_renderer(old_alexnet_renderer);
		restart_alexnet()
	}
}

$(".show_after_training").hide();

favicon_default();

enable_disable_kernel_images();
enable_disable_grad_cam();

$(document).keyup(function(e) {
	if (e.key === "Escape") { // escape key maps to keycode `27`
		chardinJs.stop();
	}
});

if(window.location.href.indexOf("function_debugger") > -1) {
	add_function_debugger();
}

document.addEventListener("DOMContentLoaded", init_own_image_files, false);

function init_own_image_files() {
	$(".own_image_files").unbind("change");
	$(".own_image_files").change(handleFileSelect);
	rename_labels();
}

function get_nr_from_own_image_files (e) {
	var currentTarget = e.currentTarget;

	var nr = null;

	$(".own_image_files").each(function (x, y) {
		if (get_element_xpath(y) == get_element_xpath(currentTarget)) { nr = x };
	});

	return nr;
}

function handleFileSelect(e) {
	if(!e.target.files || !window.FileReader) return;

	var upload_nr = get_nr_from_own_image_files(e);

	var imgDiv = $($(".own_images")[upload_nr]);

	var filesArr = Array.prototype.slice.call(e.target.files);
	filesArr.forEach(function(f) {
		if(!f.type.match("image.*")) {
			return;
		}
		var reader = new FileReader();
		reader.onload = function (e) {
			var html = '<span class="own_image_span"><img height="90" id="' + uuidv4() + '_image" src="' + e.target.result + '"><span onclick="delete_own_image(this)">&#10060;&nbsp;&nbsp;&nbsp;</span></span>';
			imgDiv.append(html);
			disable_start_training_button_custom_images();
		}
		reader.readAsDataURL(f);
	});

	disable_start_training_button_custom_images();
}

if(window.location.href.indexOf("run_tests") > -1) {
	run_tests();
}

install_memory_debugger();

load_time = Date().toLocaleString();
set_mode();
