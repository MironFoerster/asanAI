import { AfterViewInit, Component, HostListener, Input, OnInit, inject, numberAttribute } from '@angular/core';
import { LabService } from '../services/lab.service';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';
import { ModelComponent } from '../model/model.component';
import { PipeComponent } from '../pipe/pipe.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabVersion } from '../structures/lab-version';
import { CommonModule } from '@angular/common';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { AuthService } from '../services/auth.service';
import { TrainerService } from '../services/trainer.service';
import { ModelService } from '../services/model.service';
import { RenderService } from '../services/render.service';
import { TrainConfComponent } from '../train-conf/train-conf.component';
import { AddLayerComponent } from '../add-layer/add-layer.component';
import { LayerConfComponent } from '../layer-conf/layer-conf.component';
import { ProtoLayer } from '../structures/proto-layer';

class MyCustomLayer extends tf.layers.Layer {
  static className = 'MyCustomLayer'; // Add this line

  constructor() {
     super({});
  }
 
  // Implement the call method
  override call(input: tf.Tensor, kwargs: any): tf.Tensor {
     // Example: Apply a simple operation to the input tensor
     return tf.tidy(() => {
       return input.square(); // Square the input as an example operation
     });
  }
 
  // Define the output shape
  override computeOutputShape(inputShape: number[]): number[] {
     return inputShape; // The output shape is the same as the input shape
  }
 
  // Define the number of input tensors
  getNumInputs(): number {
     return 1;
  }
 }

 tf.serialization.registerClass(MyCustomLayer);


@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [RouterModule, ModelComponent, PipeComponent, ReactiveFormsModule, FormsModule, CommonModule, TrainConfComponent, AddLayerComponent, LayerConfComponent],
  templateUrl: './lab.component.html',
  styleUrl: './lab.component.sass'
})
export class LabComponent implements OnInit {
  @Input('labId') id?: string;
  @Input({alias: 'version', transform: numberAttribute}) version: number = 0;
  @Input('fromModel') fromModelId?: string;
  @Input('fromData') fromPipeId?: string;
  @Input('fromLab') fromLabId?: string;
  activeDragType: string = ""
  lab = inject(LabService)
  api = inject(ApiService)
  form = inject(FormBuilder)
  auth = inject(AuthService)
  trainer = inject(TrainerService)
  model = inject(ModelService)
  renderer = inject(RenderService)

  configLayerId?: number
  private authorization: string = ""
  showCopyDropdown: boolean = false
  showVersionsList: boolean = false
  showSaveVersion: boolean = false
  showToast: boolean = false
  toastMessage: string = ""
  commitMessage: string = ""
  versions?: LabVersion[]

  shareForm: FormGroup = this.form.group({
    username: ''
  });

  @HostListener('document:click')
  clickout() {
    this.showCopyDropdown = false
    this.showVersionsList = false
    this.showSaveVersion = false
  }

  public get clearForTraining() {
    return true
  }

  dragLayer(layerKey: string) {
    this.activeDragType = layerKey
  }

  finishDrag() {
    this.activeDragType = ""
  }

  configureLayer(layerId: number) {
    this.configLayerId = layerId
    console.log(!!this.configLayerId)
  }

  prepareLayer(layerKey: string) {
    
  }

  startTraining() {
    this.trainer.startTraining()
  }

  async printModel() {
    console.log("working")
    this.lab.trainer.data.optimizer = "adam"
    const imageNetModel = await mobilenet.load();
    console.log(imageNetModel)
    this.lab.model.loadModel('http://localhost:8000/media/models/celaflor/0/model.json')
    console.log("AFTERLOAD")
    console.log(this.renderer.data.scene)


    // // Define the model
    // const input = tf.input({shape: [1]});

    // // First dense layer with ReLU activation
    // const dense0 = tf.layers.dense({units: 10, activation: 'relu'}).apply(input);
    // const dense1 = tf.layers.dense({units: 10, activation: 'relu'}).apply(dense0);

    // // Two dense layers that take the output of the first dense layer as input
    // const dense2 = tf.layers.dense({units: 10, activation: 'relu'}).apply(dense1) as tf.SymbolicTensor;
    // const dense3 = tf.layers.dense({units: 10, activation: 'relu'}).apply(dense1) as tf.SymbolicTensor;
    // const dense4 = tf.layers.dense({units: 10, activation: 'relu'}).apply(dense1) as tf.SymbolicTensor;
    // const dense5 = tf.layers.dense({units: 10, activation: 'relu'}).apply(dense1) as tf.SymbolicTensor;

    // // Combine the outputs of the two dense layers
    // const combined = tf.layers.concatenate().apply([dense2, dense3, dense4, dense5]);

    // // Output layer
    // const output = tf.layers.dense({units: 1}).apply(combined) as tf.SymbolicTensor;

    // // Create the model
    // const model = tf.model({inputs: input, outputs: output});

    // // Compile the model
    // model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

    // console.log(model)
    // console.log(model.layers[2].getConfig())

    // model.save(tf.io.http(
    //   'http://localhost:8000/api/save-model/'+"celaflor/", 
    //   {
    //      requestInit: {
    //        method: 'POST',
    //        headers: {
    //          'Authorization': 'Token '+this.auth.getToken(),
    //          // Add any other custom headers you need
    //        }
    //      }
    //   }
    //  )).then(() => {
    //   console.log('Model saved successfully');
    // });

    const modelp = await tf.loadLayersModel('http://localhost:8000/media/models/celaflor/0/model.json');
    console.log("welp")
    console.log(modelp)
    console.log(modelp.layers[0].getConfig())

    console.log("welp")


 
    // Define the model
    const inputw = tf.input({shape: [1]});
    
    // Use the custom layer
    const customLayer = new MyCustomLayer();
    const customLayerOutput = customLayer.apply(inputw) as tf.SymbolicTensor;
    
    // Add a dense layer after the custom layer
    const denseLayer = tf.layers.dense({units: 1}).apply(customLayerOutput) as tf.SymbolicTensor;
    
    // Create the model
    const modelw = tf.model({inputs: inputw, outputs: denseLayer});
    
    // Compile the model
    modelw.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

    console.log(modelw)

    // await model.save('indexeddb://my-model');
    // const modelr = await tf.loadLayersModel('indexeddb://my-model');

    // console.log(modelr)
    // console.log(JSON.parse(modelr.toJSON() as string))

    const sharedLayer = tf.layers.dense({units: 10, activation: 'relu'});

// Define the first input
const input1 = tf.input({shape: [10]});

// Define the second input
const input2 = tf.input({shape: [10]});

// Apply the shared layer to both inputs
const output1 = sharedLayer.apply(input1) as tf.SymbolicTensor;
const output2 = sharedLayer.apply(input2) as tf.SymbolicTensor;

// Define the model with two inputs and two outputs
const modeli = tf.model({inputs: [input1, input2], outputs: [output1, output2]});

// Compile the model
modeli.compile({optimizer: 'adam', loss: 'meanSquaredError'});
console.log(modeli)
  }

  toggleCopyDropdown(event: Event) {
    event.stopPropagation()
    this.showCopyDropdown = !this.showCopyDropdown
  }

  shareSubmit() {
    console.log('Form submitted:', this.shareForm.value);
    console.log(this.lab.getId())

    this.api.post("api/share-lab/", {"username":this.shareForm.value.username, "labId": this.lab.getId()}).subscribe({
      next: (sharedWithUser: string) => {
        this.displayToast("Shared this Lab with "+this.shareForm.value.username)
      }, 
      error: (error) => {
        this.displayToast("Sharing failed. Check the username and try again!")
      }
    })
  }

  displayToast(message: string) {
    this.showToast = true;
        setTimeout(() => {
          this.showToast = false
        }, 3000)
  }

  getAuthorization() {
    return this.authorization
  }

  loadAuthorization() {
    this.api.get("lab-authorization/"+this.id).subscribe({
      next: (authorization: string) => {
        this.authorization = authorization
      },
      error: (error) => {
        this.authorization = ""
        console.log("get authorization failure")
      }
    })
  }

  saveVersion() {
    if (this.commitMessage.trim() === "") {
      this.displayToast("Cannot save without commit message!")
    }
    this.api.get("save-version/"+this.id+"/"+this.commitMessage).subscribe({
      next: (authorization: string) => {
        
      },
      error: (error) => {
        this.displayToast("Saving Failed")
        this.authorization = ""
        console.log("get authorization failure")
      }
    })
  }

  ngOnInit(): void {
    if (!!this.id) {
      // load existing lab
      if (!this.lab.hasId(this.id)) { // check if already loaded
        this.lab.load(this.id, this.version)
        this.loadAuthorization()
      }
    } else {
      // load anonymous lab
      if (!this.lab.hasId(null)) { // check if already loaded
        this.lab.loadAnonymous()
        this.authorization = "owning"
      }
    }

    if (!!this.fromLabId) {
      this.lab.clone(this.fromLabId)
    } else {
      if (!!this.fromPipeId) {
        this.lab.pipe.clone(this.fromPipeId)
      }
      if (!!this.fromModelId) {
        this.lab.model.clone(this.fromModelId)
      }
    }
  }
}
