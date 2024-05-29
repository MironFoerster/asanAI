import { Component } from '@angular/core';
import * as Papa from 'papaparse';
import * as tf from '@tensorflow/tfjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choose-data-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './choose-data-upload.component.html',
  styleUrl: './choose-data-upload.component.sass'
})
export class ChooseDataUploadComponent {
  csvData: any[] = [];
  csvFile: File | null = null;
 
  onFileChange(event: any) {
     const file = event.target.files[0];
     if (file) {
       this.csvFile = file;
       Papa.parse(file, {
         header: true,
         complete: (results: { data: any[]; }) => {
           this.csvData = results.data;
           console.log(this.csvData)
         }
       });
     }
  }
 
  convertToTfjsDataset() {
     if (!this.csvData.length) {
       console.error('No data to convert to TensorFlow.js dataset.');
       return;
     }
 
     // Assuming the first column is the label and the rest are features
     const labels = this.csvData.map(row => row[Object.keys(row)[0]]);
     const features = this.csvData.map(row => {
       const featureRow: { [key: string]: any } = {};
       Object.keys(row).forEach((key, index) => {
         if (index !== 0) { // Skip the label column
           featureRow[key] = row[key];
         }
       });
       return featureRow;
     });
 
     // Convert to TensorFlow.js dataset
     const dataset = tf.data.array(features).map(feature => ({xs: feature, ys: labels}));
  }
}
