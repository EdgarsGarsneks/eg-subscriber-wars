export class SubscriberComponent {
    constructor(name, img) {
        this.name = name;
        this.img = new Image();
        this.img.src = img;
    }
}