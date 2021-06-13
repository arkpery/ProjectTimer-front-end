import { Component, Input, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSave, faTrash, faAppleAlt, faHome, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ui-button',
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss']
})
export class UiButtonComponent implements OnInit {
  @Input() content!: string;
  @Input() type!: string;
  @Input() icon!: string;
  icons?: Array<{ key: string, value: IconProp }>;


  constructor() { }

  ngOnInit(): void {
    this.icons = [
      {
        key: "save",
        value: faSave
      },
      {
        key: "trash",
        value: faTrash
      },
      {
        key: "home",
        value: faHome
      },
      {
        key: "default",
        value: faAppleAlt
      }
    ];
  }

  getIcon(name: string): IconProp  {
    const icon = this.icons?.filter(icon => icon.key === name);

    if (icon?.length) {
      return (icon[0].value);
    }
    return (faAppleAlt);
  }

}
