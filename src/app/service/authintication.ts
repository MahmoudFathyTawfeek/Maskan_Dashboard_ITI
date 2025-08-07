import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Authintication {

  propsub:BehaviorSubject<boolean>
  constructor() {
    this.propsub=new BehaviorSubject<boolean>(false)
   }


  login(username:string,password:string){

    let token="mahmoudtawfeek"

    localStorage.setItem('Token',token)

    this.propsub.next(true)
  }

  logout(){
    localStorage.removeItem('Token')

       this.propsub.next(true)
  }

  get userLoged():boolean{
    return (localStorage.getItem('Token'))?true:false
  }

  userloggedmethod(){
    return this.propsub
  }
}
