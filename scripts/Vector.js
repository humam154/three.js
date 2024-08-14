class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    mult(b) {
        var c = new Vector();
        c.x = this.x * b;
        c.y = this.y * b;
        c.z = this.z * b;
        return c;
    }

    div(b) {
        var c = new Vector();
        c.x = this.x / b;
        c.y = this.y / b;
        c.z = this.z / b;
        return c;
    }

    sum(b) {
        var c = new Vector();
        c.x = this.x + b.x;
        c.y = this.y + b.y;
        c.z = this.z + b.z;
        return c;
    }

    printVector() {
        console.table(this);
    }

    len() {
        var length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        return length;
    }

    norm() {
        var normVector = new Vector();
        if (this.len() < 0.0001) {
            return normVector;
        }
        normVector = this.div(this.len());
        return normVector;
    }
    cross(b) {
        var C = new Vector();
        C.x = this.y * b.z - (this.z * b.y);
        C.y = -(this.x * b.z - (this.z * b.x));
        C.z = this.x * b.y - (this.y * b.x);
        return C;
    }
    angel(b) {
        var aa = this.norm();
        var bb = b.norm();
        var c = aa.cross(bb);
        var len = c.len();
        var th = Math.asin(len) * 180 / Math.PI;;
        var cc = c.norm();

        return cc.mult(th);
    }
} 