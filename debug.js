"use strict";

var _full_debug_log = [];

var printed_msgs = [];

function log_once (...args) {
	var md5 = JSON.stringify(args);

	if(printed_msgs.includes(md5)) {
		return;
	}

	printed_msgs.push(md5);

	log(...args);
}

function colorlog (color, msg) {
	log("%c" + msg, "background: " + color + "; color: white");
}

function logt(...msg) {
	log(msg);
	console.trace();
}

function info (...args) {
	args.forEach(arg => console.info(arg));
	args.forEach(arg => l("[INFO] " + arg));

	if(enable_log_trace) {
		console.trace();
	}

	var struct = {
		'type': 'info',
		'stacktrace': get_stack_trace(),
		'log': args,
		'time': parse_int(Date.now() / 1000)
	};

	_full_debug_log.push(struct);
}

function err (...args) {
	args.forEach(arg => console.error(arg));
	args.forEach(arg => l("[ERROR] " + arg));

	if(enable_log_trace) {
		console.trace();
	}

	var struct = {
		'type': 'err',
		'stacktrace': get_stack_trace(),
		'log': args,
		'time': parse_int(Date.now() / 1000)
	};

	_full_debug_log.push(struct);
}

function wrn (...args) {
	args.forEach(arg => console.warn(arg));
	args.forEach(arg => l("[WARN] " + arg));

	if(enable_log_trace) {
		console.trace();
	}

	var struct = {
		'type': 'warn',
		'stacktrace': get_stack_trace(),
		'log': args,
		'time': parse_int(Date.now() / 1000)
	};

	_full_debug_log.push(struct);
}

function dbg (...args) {
	args.forEach(arg => console.debug(arg));
	args.forEach(arg => l("[DEBUG] " + arg));

	if(enable_log_trace) {
		console.trace();
	}

	var struct = {
		'type': 'debug',
		'stacktrace': get_stack_trace(),
		'log': args,
		'time': parse_int(Date.now() / 1000)
	};

	_full_debug_log.push(struct);
}

function log (...args) {
	args.forEach(arg => console.log(arg));
	args.forEach(arg => l(arg));

	if(enable_log_trace) {
		console.trace();
	}


	var struct = {
		'type': 'log',
		'stacktrace': get_stack_trace(),
		'log': args,
		'time': parse_int(Date.now() / 1000)
	};

	_full_debug_log.push(struct);
}

function header_warning (msg) {
	log("%c" + msg, "background: orange; color: black");
}

function header_error (msg) {
	log("%c" + msg, "background: red; color: white");
}

function header (msg) {
	log("%c" + msg, "background: #222; color: #bada55");
}

function datadebug (msg) {
	if (window.location.href.indexOf("datadebug") > -1) {
		log(msg);
	}
}

function traindebug (msg) {
	if (window.location.href.indexOf("traindebug") > -1) {
		log(msg);
	}
}

function headerdatadebug (msg) {
	if (window.location.href.indexOf("datadebug") > -1) {
		log("%c" + msg, "background: #222; color: #bada55");
	}
}
function headerguidebug (msg) {
	if (window.location.href.indexOf("guidebug") > -1) {
		log("%c" + msg, "background: #222; color: #bada55");
	}
}

function get_current_model_weights_identifier () {
	tf.sum(model.layers[0].getWeights()[0]).print();
}

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function get_param_names(func) {
	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if(result === null)
		result = [];
	return result;
}


function add_memory_debugger () {
	var ORIGINAL_FUNCTION_PREFIX = "___original___";
	var current_functions = Object.keys(window);

	for (var i in window) {
	    if(
		    i != "assert" &&							// Disable assert output
		    ![
			    "delay",
			    "Swal",
			    "add_function_debugger",
			    "get_param_names",
			    "memory_debugger",
			    "_allow_training",
			    "fix_viz_width",
			    "allow_training",
			    "allow_training",
			    "get_chosen_dataset",
			    "show_load_weights",
			    "get_current_chosen_object_default_weights_string",
			    "get_chosen_dataset",
			    "dispose",
			    "get_weights_shape",
			    "get_weights_as_string",
			    "get_drawing_board_on_page",
			    "Atrament"
		    ].includes(i) &&		// exclude these functions
		    typeof(window[i]) == "function" &&					// use only functions
		    i.indexOf(ORIGINAL_FUNCTION_PREFIX) === -1 &&			// do not re-do functions
		    !current_functions.includes(ORIGINAL_FUNCTION_PREFIX + i) &&	// do not re-do functions
		    window[i].toString().indexOf("native code") === -1 &&		// Ignore native functions
		    i != "$"								// Do not debug jquery
	    ) {
		    var param_names = get_param_names(window[i]);

		    var args_string = param_names.join(", ");

		    var original_function = window[i];

		    try {
			    var execute_this = `
			    window["${ORIGINAL_FUNCTION_PREFIX}${i}"] = window[i];
			    window["${i}"] = function (${args_string}) { var start_tensors = tf.memory()["numTensors"];

					var result = window["${ORIGINAL_FUNCTION_PREFIX}${i}"](${args_string});

					var end_tensors = tf.memory()["numTensors"];
					if((end_tensors - start_tensors) != 0) {
						log((end_tensors - start_tensors) + " new tensors in ${i}");
					}
					return result;
			    }
			    `;

			    eval(execute_this);
		    } catch (e) {
			    wrn(e);
			    log(i);
			    log(param_names);
			    window[i] = original_function;
		    }
	    }
	}
}

function add_function_debugger () {
	var ORIGINAL_FUNCTION_PREFIX = "___original___";
	var current_functions = Object.keys(window);

	for (var i in window) {
	    if(
		    i != "assert" &&							// Disable assert output
		    ![
			    "delay",
			    "Swal",
			    "get_python_name",
			    "quote_python",
			    "add_function_debugger",
			    "write_model_summary",
			    "Atrament",
			    "check_number_values",
			    "atrament_data",
			    "get_model_config_hash",
			    "grad_class_activation_map",
			    "enable_train",
			    "is_numeric",
			    "colorize",
			    "md5",
			    "is_hidden_or_has_hidden_parent",
			    "get_cookie",
			    "display_delete_button",
			    "get_id_from_train_data_struct",
			    "decille",
			    "headerdatadebug",
			    "get_param_names",
			    "predict_webcam",
			    "memory_debugger",
			    "_allow_training",
			    "fix_viz_width",
			    "allow_training",
			    "allow_training",
			    "get_chosen_dataset",
			    "show_load_weights",
			    "get_current_chosen_object_default_weights_string",
			    "get_chosen_dataset",
			    "dispose",
			    "get_weights_shape",
			    "get_weights_as_string",
		    ].includes(i) &&		// exclude these functions
		    typeof(window[i]) == "function" &&					// use only functions
		    i.indexOf(ORIGINAL_FUNCTION_PREFIX) === -1 &&			// do not re-do functions
		    !current_functions.includes(ORIGINAL_FUNCTION_PREFIX + i) &&	// do not re-do functions
		    window[i].toString().indexOf("native code") === -1 &&		// Ignore native functions
		    i != "$"								// Do not debug jquery
	    ) {
		    var param_names = get_param_names(window[i]);

		    var args_string = param_names.join(", ");

		    var original_function = window[i];

		    try {
			    var execute_this = `
			    window["${ORIGINAL_FUNCTION_PREFIX}${i}"] = window[i];
			    window["${i}"] = function (${args_string}) {
					call_depth = call_depth + 1;
					log("    ".repeat(call_depth) + "${i}");
					var _start_time = + new Date();
					if(!Object.keys(function_times).includes("${i}")) {
						function_times["${i}"] = {};
						function_times["${i}"]["whole_time"] = 0;
						function_times["${i}"]["call_count"] = 0;
					}
					var result = window["${ORIGINAL_FUNCTION_PREFIX}${i}"](${args_string});
					var _end_time = + new Date();
					function_times["${i}"]["whole_time"] = function_times["${i}"]["whole_time"] + (_end_time - _start_time);
					function_times["${i}"]["call_count"] = function_times["${i}"]["call_count"] + 1;

					call_depth = call_depth - 1;
					return result;
			    }
			    `;

			    eval(execute_this);
		    } catch (e) {
			    wrn(e);
			    log(i);
			    log(param_names);
			    window[i] = original_function;
		    }
	    }
	}
}

function tf_debug () {
	if($("#enable_tf_debug").is(":checked")) {
		tf.enableDebugMode();
		$("#enable_tf_debug").prop("disabled", true);
	}
}

function colorize (text, color) {
	if(color) {
		return "<span style='color: " + color + "'>" + text + "</span>";
	}
	return text;
}

function memory_debugger () {
	var memory = tf.memory();

	var bytes = memory["numBytes"];
	var gpu_bytes = memory["numBytesInGPU"];

	var num_tensors =  memory["numTensors"]; // Object.keys(tensors).length;
	var ram_mb = bytes / 1024 / 1024;
	ram_mb = ram_mb.toFixed(2);
	var gpu_mb = gpu_bytes / 1024 / 1024;
	if(gpu_mb) {
		gpu_mb = gpu_mb.toFixed(2);
	}

	var tensor_color = "";
	var gpu_color = "";
	var cpu_color = "";

	if(last_num_global_tensors > num_tensors) {
		tensor_color = "#00ff00";
	} else if (last_num_global_tensors < num_tensors) {
		tensor_color = "#ff0000";
	}

	if(last_tensor_size_cpu > ram_mb) {
		cpu_color = "#00ff00";
	} else if (last_tensor_size_cpu < ram_mb) {
		cpu_color = "#ff0000";
	}

	if(last_tensor_size_gpu > gpu_mb) {
		gpu_color = "#00ff00";
	} else if (last_tensor_size_gpu < gpu_mb) {
		gpu_color = "#ff0000";
	}

	var debug_string = `${language[lang]["tensors"]}: ` + colorize(num_tensors, tensor_color) + ", RAM: " + colorize(ram_mb, cpu_color) + "MB";

	if(gpu_mb.toString().match(/^\d+(?:\.\d+)?$/)) {
		debug_string = debug_string + ", GPU: " + colorize(gpu_mb, gpu_color) + "MB"
	}

	if(Object.keys(_custom_tensors).length) {
		debug_string += ", asanAI: " + Object.keys(_custom_tensors).length;
	}

	var memdeb = document.querySelector('#memory_debugger_div');

	if(memdeb) {
		if(memdeb.innerHTML != debug_string) {
			memdeb.innerHTML = debug_string;
		}
	} else {
		wrn("memory_debugger_div not found. Did you, by any chance, manually remove it?");
	}

	last_num_global_tensors = num_tensors;
	last_tensor_size_cpu = ram_mb;
	last_tensor_size_gpu = gpu_mb;
}

function install_memory_debugger () {
	$(function(){
		memory_debugger();
		memory_debug_interval = setInterval(memory_debugger, 400);
	});

}

function log_mem () {
	log("=====================");
	log("Number of tensors: " + tf.memory()["numTensors"]);
	log("MB in RAM:" + (tf.memory().numBytes / (1024*1024)) + "MB");
}

function get_mem () {
	return tf.memory();
}

function add_optimizer_debugger () {
	tf.train.sgd = function (e) { log("SGD. Learning rate:", e); var res = original_sgd(e); log("Result:", res); return res; }
	tf.train.rmsprop = function (e, t, n, r, a) { log("RMSProp. learningRate, decay, momentum, epsilon, centered:", e, t, n, r, a); var res = original_rmsprop(e, t, n, r, a); log("Result:", res); return res; }
	tf.train.adamax = function (e, t, n, r, a) { log("adamax. learningRate, beta1, beta2, epsilon, decay:", e, t, n, r, a); var res = original_adamax(e, t, n, r, a); log("Result:", res); return res; }
	tf.train.adam = function (e, t, n, r) { log("adam. learningRate, beta1, beta2, epsilon", e, t, n, r); var res = original_adam(e, t, n, r); log("Result:", res); return res; }
	tf.train.adadelta = function (e, t, n) { log("adadelta. learningRate, rho, epsilon", e, t, n); var res = original_adadelta(e, t, n); log("Result:", res); return res; }
	tf.train.adagrad = function (e, t) { log("adagrad. learningRate, rho, epsilon", e, t); var res = original_adagrad(e, t); log("Result:", res); return res; }
	tf.train.momentum = function (e, t, n) { log("momentum. learningRate, momentum, useNesterov", e, t, n); var res = original_momentum(e, t, n); log("Result:", res); return res; }

}

function data_debug (...data) {
	log(">>>>>>>>>>>>>>>>>>");
	for (var i = 0; i < data.length; i++) {
		if(typeof(data[i]) == "object" && Object.keys(data[i]).includes("isDisposedInternal")) {
			log("Tensor", data[i]);
			try {
				data[i].print();
			} catch (e) {
				log("Error while printing: ", e);
			}
		} else {
			log(typeof(data[i]), data[i]);
		}
	}

	console.trace();
	log("<<<<<<<<<<<<<<<<<<");
}

function highlight_element(xpath) {
	const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (element) {
		element.style.backgroundColor = 'yellow';
		element.style.margin = '20px';
	}
}

function unhighlight_element(xpath) {
	const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (element) {
		element.style.backgroundColor = '';
		element.style.margin = '0px';
	}
}

function cosmo_debugger () {
	if(!is_cosmo_mode) {
		$("#cosmo_debugger").remove();
		return;
	}

	if(!enable_cosmo_debugger) {
		$("#cosmo_debugger").remove();
		return;
	}

	var cosmo_wave_debug_str = "current_skills: [" + JSON.stringify(current_skills) + "]";
	$("#cosmo_debugger").length ? $("#cosmo_debugger").html(cosmo_wave_debug_str) : $("body").append($(`<div id='cosmo_debugger' style='position: fixed; left: 700px; top: 10px; background-color: green; color: white; word-wrap: anywhere;'>Cosmo-Wave: ${cosmo_wave_debug_str}</div>`));

	$(".manicule_debugger").remove()

	var dbgf = (i, x) => {
		if(!is_hidden_or_has_hidden_parent(x)) {
			var xpath = get_element_xpath(x);
			var left = $(x).offset().left + $(x).width();
			var t = $(x).offset()["top"] + Math.random() * 20;

			var cosmo_debug_arr = [];

			var r = $(x).data("required_skills");

			if(typeof(r) == "string") {
				r = r.split(/,/);
				if(r.length) {
					for (var k = 0; k < r.length; k++) {
						var s = parse_required_skills(r[k]);
						var name = s[0];
						var val = s[1];

						if(Object.keys(current_skills).includes(name) && name && Object.keys(current_skills).includes(name) && val == current_skills[name]) {
							r[k] += "&#9989;";
						} else {
							r[k] += "&#10060;";
						}
					}
				}
				cosmo_debug_arr.push("required_skills: [" + r.join(", ") + "]");
			} else {
				cosmo_debug_arr.push("required_skills empty");
			}

			var s = $(x).data("show_again_when_new_skill_acquired");

			if(typeof(s) == "string") {
				s = s.split(/,/);
				if(s.length) {
					for (var k = 0; k < s.length; k++) {
						if(s[k]) {
							if(Object.keys(current_skills).includes(s[k])) {
								s[k] += "&#9989;";
							} else {
								s[k] += "&#10060;";
							}
						}
					}
				}
				cosmo_debug_arr.push("show_again_when_new_skill_acquired: [" + s.join(", ") + "]");
			} else {
				//cosmo_debug_arr.push("show_again_when_new_skill_acquired empty");
			}

			var cosmo_debug_str = cosmo_debug_arr.join(", ");

			$("body").append(`<div onmouseover='highlight_element("${xpath.replace(/"/g, '\\"')}")' onmouseout='unhighlight_element("${xpath.replace(/"/g, '\\"')}")' style='position: absolute; top: ${t}px; left: ${left}px; background-color: rgba(255, 150, 150, 128); text-shadow: #fff 1px 1px 1px;' class='manicule_debugger'>${cosmo_debug_str}</div>`);
		}
	}

	$(".cosmo").each(dbgf)
}

async function profile (func, ...args) {
	const profile = await tf.profile(await func(...args));

	log(`newBytes: ${profile.newBytes}`);
	log(`newTensors: ${profile.newTensors}`);
	log(`byte usage over all kernels: ${profile.kernels.map(k => k.totalBytesSnapshot)}`);
}

function label_debug (...args) {
	if(!set_label_debug) {
		return;
	}

	log(...args);
	console.trace();
}

function debug (...args) {
	console.debug(...args);
}

function create_graphviz_function_call_graph () {
	const dependencies = {};

	for (const functionName in window) {
		if (typeof window[functionName] === 'function' && functionName !== 'tf') {
			dependencies[functionName] = [];

			// Extract function body and search for function calls within it
			const fnBody = window[functionName].toString();
			const fnCalls = fnBody.match(/\w+\(/g);

				if (fnCalls) {
					fnCalls.forEach(fnCall => {
						const calledFunctionName = fnCall.replace('(', '');

						// Ensure it's not referring to itself
						if (calledFunctionName !== functionName && window[calledFunctionName]) {
							dependencies[functionName].push(calledFunctionName);
						}
					});
				}
		}
	}

	let dotFileContent = 'digraph FunctionCalls {\n';
	for (const functionName in dependencies) {
		const calledFunctions = dependencies[functionName];
		calledFunctions.forEach(calledFunction => {
			dotFileContent += `  "${functionName}" -> "${calledFunction}";\n`;
		});
	}
	dotFileContent += '}\n';

	// You can log the dotFileContent or use other methods to save it as needed.
	log(dotFileContent); // Example: Logging the content to the console
}

// Execute the analysis
// create_graphviz_function_call_graph();
function detect_and_color_stacktrace(input_string) {
	var pattern = /([\w$]+)@((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
	var coloredString = input_string.replace(pattern, function(match, funcName, url) {
		return "<span style='color: #af0f0f;'>" + funcName + "</span>@<span style='color: #0f0faf;'>" + url + "</span>";
	});

	return coloredString;
}

function create_html_table_from_json(data) {
	try {
		// Parse the input string into a JavaScript object

		// Check if data is an array with at least one element
		if (Array.isArray(data) && data.length > 0) {
			// Create an HTML table element
			var table = document.createElement("table");

			// Create the table header row
			var headerRow = document.createElement("tr");

			// Extract and store the keys from the first element
			var keys = Object.keys(data[0]);

			// Iterate through the keys to create header cells
			keys.forEach(function (key) {
				var headerCell = document.createElement("th");
				headerCell.textContent = key;
				headerRow.appendChild(headerCell);
			});

			// Append the header row to the table
			table.appendChild(headerRow);

			// Create table rows for each data element
			data.forEach(function (item) {
				var row = document.createElement("tr");

				// Iterate through the keys and create table cells
				keys.forEach(function (key) {
					var cell = document.createElement("td");
					cell.innerHTML = "<pre>" + detect_and_color_stacktrace("" + item[key]) + "</pre>";
					row.appendChild(cell);
				});

				// Append the row to the table
				table.appendChild(row);
			});

			// Add the table to the HTML document
			return table.outerHTML;
		} else {
			// Handle the case when data is empty
			wrn("Data is empty or not in the expected format.");
		}
	} catch (error) {
		// Log and handle any errors
		err("An error occurred:", error);
	}
}

function send_post_request(url, htmlCode) {
	try {
		const xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					// Request was successful
					log('Anonymized bug report was sent.');
				} else {
					// Request failed
					wrn('Anonymized bug report could not be sent:', xhr.status);
				}
			}
		};
		const data = 'html_code=' + encodeURIComponent(htmlCode); // Encode the data
		xhr.send(data);
	} catch (error) {
		// Handle any exceptions
		err('An error occurred:', error);
	}
}

async function _take_screenshot () {
	const screenshotTarget = document.body;

	var base_64 = "";

	html2canvas(screenshotTarget).then((canvas) => {
		base_64 = canvas.toDataURL("image/png");
	});

	while (!base_64) {
		log("Waiting for screenshot...");
		await delay(200);
	}

	return base_64;
}

async function send_bug_report () {
	var html = '';

	if(privacy_is_tainted) {
		console.log("Privacy was tainted. Not taking a screenshot");
	} else {
		html += "<h1>Screenshot</h1>"

		html += '<img src="' + await _take_screenshot() + '" />';
	}

	html += "<h1>Browser-Information</h1>"

	html += "User-Agent: " + navigator.userAgent;

	html += "<h1>Model-Structure</h1>"

	html += "<pre>" + JSON.stringify(await get_model_structure(), null, 2) + "</pre>";

	html += "<h1>Logs</h1>";

	html += create_html_table_from_json(_full_debug_log);

	send_post_request("save_error_log.php", html)
}

function taint_privacy () {
	if(privacy_is_tainted) {
		return;
	}

	/*
	log("tainting privacy");
	console.trace();
	*/

	privacy_is_tainted = true;
}
