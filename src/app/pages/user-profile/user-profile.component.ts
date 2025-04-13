import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service'
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
  ) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(data => {
      this.user = structuredClone(data);
      console.log(this.user);

    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges(): void {
    this.isEditMode = false;
    this.userService.updateUser(this.user._id, this.user).subscribe(updateResponse => {
      this.user = structuredClone(updateResponse.user);
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
      if(!this.user.profile.addresses){
        this.user.profile.addresses=[];
      }
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
      if(!this.user.profile.phone_numbers){
        this.user.profile.phone_numbers=[];
      }
      this.user.profile.phone_numbers.push(this.newPhoneNumber.trim());
      this.newPhoneNumber = '';
    }
  }

  removeNumber(index: number) {
    this.user.profile.phone_numbers.splice(index, 1);
  }

  newCard = {
    card_number: '',
  };

  addCard() {
    if (!this.user.payment_details.card) {
      this.user.payment_details.card = [];
    }
    this.user.payment_details.card.push(structuredClone(this.newCard));
    this.newCard = { card_number: ''};
  }

  removeCard(index: number) {
    this.user.payment_details.card.splice(index, 1);
  }



}
