import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "../navbar/navbar";
import { Footer } from "../footer/footer";
import { Header } from "../header/header";




@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Navbar, Footer, Header],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {

}
