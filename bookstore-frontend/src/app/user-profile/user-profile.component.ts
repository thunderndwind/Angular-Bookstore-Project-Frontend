import { Component } from '@angular/core';
import { UserService } from '../services/user/user.service'
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-user-profile',
  imports: [FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  user: any;
  isEditMode = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
      const userId = this.route.snapshot.paramMap.get('id');
      
      if (userId) {
        this.userService.getUser(userId).subscribe(data => {
          this.user = data;
        });
      }
    }

    toggleEditMode(): void {
      this.isEditMode = !this.isEditMode;
    }
  
    saveChanges(): void {
      this.isEditMode = false;
      console.log('ana not saved');
      this.userService.updateUser(this.user._id, this.user).subscribe(updateResponse => {
        console.log('ana saved');
        this.user = structuredClone(updateResponse.user);
        console.log(this.user);
      });
    }  

    newAddress = {
      street: '',
      city: '',
      governorate: '',
      postalCode: ''
    };
  
    addAddress() {
      if (
        this.newAddress.street.trim() &&
        this.newAddress.city.trim() &&
        this.newAddress.governorate.trim() &&
        this.newAddress.postalCode.trim()
      ) {
        this.user.profile.addresses.push(structuredClone(this.newAddress));
        this.newAddress = { street: '', city: '', governorate: '', postalCode: '' };
      }
    }
  
    removeAddress(index: number) {
      this.user.profile.addresses.splice(index, 1);
    }

  newPhoneNumber: string = '';

  addNumber() {
    if (this.newPhoneNumber.trim()) {
      this.user.profile.phoneNumbers.push(this.newPhoneNumber.trim());
      this.newPhoneNumber = '';
    }
  }

  removeNumber(index: number) {
    this.user.profile.phoneNumbers.splice(index, 1);
  }


}
