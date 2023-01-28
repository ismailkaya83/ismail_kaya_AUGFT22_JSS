class MemeObject {
    constructor(id, name, url, width, height, box_count) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.width = width;
        this.height = height;
        this.box_count = box_count;
        this.visited = false;
    }
}

module.exports = MemeObject;