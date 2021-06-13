import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ProjectTimer';
  links = [
    {
      id: 1,
      link: "/home",
      title: "Accueil"
    },
    {
      id: 2,
      link: "/groups",
      title: "Groupes"
    },
    {
      id: 3,
      link: "/projects",
      title: "Projets"
    },
    {
      id: 4,
      link: "/timers",
      title: "Timers"
    }
  ];
}
