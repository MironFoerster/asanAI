import { Component, Input, OnInit, inject } from '@angular/core';
import { LabService } from '../services/lab.service';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';
import { ModelComponent } from '../model/model.component';
import { PipeComponent } from '../pipe/pipe.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [RouterModule, ModelComponent, PipeComponent, ReactiveFormsModule],
  templateUrl: './lab.component.html',
  styleUrl: './lab.component.sass'
})
export class LabComponent implements OnInit {
  @Input('labId') id?: string;
  @Input('fromModel') fromModelId?: string;
  @Input('fromData') fromPipeId?: string;
  @Input('fromLab') fromLabId?: string;
  lab = inject(LabService)
  api = inject(ApiService)
  form = inject(FormBuilder)
  private access: string = ""
  showToast: boolean = false
  toastMessage: string = ""

  shareForm: FormGroup = this.form.group({
    username: ''
  });

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

  accessLevel() {
    return this.access
  }

  getAccess(id: string) {
    this.api.get("get-access/"+this.id).subscribe({
      next: (accessData: string) => {
        this.access = accessData
      },
      error: (error) => {
        this.access = ""
        console.log("get access failure")
      }
    })
  }

  ngOnInit(): void {
    // distinguishes id- and anonymous-load
    if (!!this.id) {
      if (!this.lab.hasId(this.id)) { // prevents reload
        this.lab.load(this.id)
        this.getAccess(this.id)
      }
    } else {
      if (!this.lab.hasId(null)) { // prevents reload
        this.lab.loadAnonymous()
        this.access = "writing"
      }
    }

    if (!!this.fromLabId) {
      this.lab.importLab(this.fromLabId)
    } else {
      if (!!this.fromPipeId) {
        this.lab.importPipe(this.fromPipeId)
      }
      if (!!this.fromModelId) {
        this.lab.importModel(this.fromModelId)
      }
    }
  }
}
