import { ValidatorFn , AbstractControl, ValidationErrors} from "@angular/forms";

export class customValidators {
  
  static passWordValidators() : ValidatorFn{
    return (control: AbstractControl):
    ValidationErrors | null => {
      const value = control.value;
      if(!value) {
        return null;
      }
      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const isValidLength = value.length >= 8;
      const passWordValid = hasNumber && hasLower && hasUpper && isValidLength;
      return !passWordValid ?
      {passwordstrength : true} : null
    }
  }


  static matchPassword
  (form:AbstractControl)
  : ValidationErrors | null {
    const password = form.get('password')?.value;

    const retypePassword = form.get('retypePassword')?.value;

    if(password !== retypePassword)
    {
      return {passwordMismatch : true};
    }
    return null
  }
}
