import { Vector } from "../scripts/Vector.js";
class Submarine {
    constructor() {
        this.m = 48e6; // kg 450//  24500 tons
        this.pos = new Vector();
        this.v = new Vector();
        this.g = new Vector(0, -9.8, 0); //9.8 m.s-1
        this.p = 1027; //kg/m3  1.027 g/cm^3  // كثافة الماء
        this.totalVolu = 48300; //m3//50000
        this.totalContainer = 7500; // m3//10000
        this.currentContainerAirPerc = 100; // %
        this.R = 6; //m
        this.Re = 0.1; //رقم رينولدز 
        this.D = this.R * 2; // قطر الاسطوانة (الغواصة) 
        this.mu = 0.00108; //
        this.L = 175 // m طول الغواصة 
        this.thetaZ = 0; // زاوية الهجوم 
        this.lengthFin = 3;
        this.widthFin = 1;
        this.heightFin = 0.4;
        this.thetaY = 0;
        this.thetaX = 0;
        this.speed = 0;

    }

    calc() {
        let dpos;
        let dt = 0.01;
        let a;
        let dv;

        a = this.fTotal().div(this.m);
        dv = a.mult(dt);
        this.v = this.v.sum(dv);

        dpos = this.v.mult(dt);
        this.pos = this.pos.sum(dpos);
        console.log("pos y ", this.pos.y);
    }
    front() {

        var frontVector = new Vector();
        
        frontVector.x = -Math.sin(this.thetaY*Math.PI/180)*Math.cos(this.thetaX*Math.PI/180);
        frontVector.y = Math.sin(this.thetaX*Math.PI/180);
        frontVector.z = -Math.cos(this.thetaY*Math.PI/180)*Math.cos(this.thetaX*Math.PI/180);
        console.log("xxxxxxxxxx", frontVector.x);
        console.log("yyyyyyyy", frontVector.y);
        console.log("zzzzzzz", frontVector.z);
        return frontVector;
    }


    fTotal() {
        return this.arkamedes().sum(this.weight()).sum(this.forceDragCylinder()).sum(this.forceLiftCylinder()).sum(this.forceDragFin().mult(2)).sum(this.forceLiftFin().mult(2)).sum(this.fSpeed());
    }

    fSpeed() {
        var fv = this.front();
        console.log("spppeeeeddd========" + this.speed)
        console.log("Front Vector:", fv);
        if (this.speed < 0.0001) {
            return new Vector(0, 0, 0);
        } else {
            fv = this.front().mult(this.speed).mult(this.m);
            console.log("Speed Vector:", fv);
            return fv;
        }
    }



    weight() {
        return this.g.mult(this.m);
    }

    volAboveWater() {
        if (-this.pos.y > this.R) { // الغواصة تحت الماء بالكامل 
            return 0;
        }
        if (this.pos.y >= this.R) { // الغواصة فوق الماء بالكامل 
            return this.totalVolu;
        }

        // حساب الغمر الجزئي
        let ac = Math.abs(this.pos.y) / this.R;
        let tetaR = 2 * Math.acos(ac);
        let VV = (this.R * this.R / 2) * (tetaR - Math.sin(tetaR));

        if (this.pos.y > 0) {
            VV = this.totalVolu - VV;
        }
        return VV;
    }

    volu() {
        console.log("this.volAboveWater()  ", this.volAboveWater());
        let waterVolInContainer = this.totalContainer * (1 - this.currentContainerAirPerc / 100.0);
        let vvv = this.totalVolu - waterVolInContainer - this.volAboveWater();
        console.log("vol ", vvv);
        return vvv;
    }

    arkamedes() {
        let dfarc;
        dfarc = this.g.mult(this.p).mult(this.volu()).mult(-1);
        return dfarc;
    }

    getAngA() {

    }

    getCdCylinder() {

        let Cd = 0.8 + Math.sin(this.thetaZ) * 0.45//c.legnth
        return Cd
    }

    getCdFin() {
        // استخدام صيغة تقريبية لمعادل السحب
        let Cd = 0.8 + Math.sin(this.thetaZ) * 0.45;
        return Cd;
    }

    getClCylinder() {
        let Cl = 1.2 * Math.sin(2 * this.thetaZ);
        return Cl;
    }
    getClFin() {
        // استخدام صيغة تقريبية لمعادل الرفع
        let Cl = 1.2 * Math.sin(2 * this.thetaZ);
        return Cl;
    }

    getACylinder() {
        let A;
        let circularSurface;
        let rectangularSurface;
        circularSurface = Math.sin(this.thetaZ) * Math.PI * this.R * this.R;
        rectangularSurface = Math.cos(this.thetaZ) * this.D * this.L;
        A = circularSurface + rectangularSurface;
        return A;
    }

    getAFin() {
        let A;
        let frontSurface;
        let topSurface;
        let sideSurface;

        // افتراض أن زاوية الهجوم AOA بالنسبة للسطح الأمامي لمتوازي المستطيلات
        frontSurface = this.heightFin * this.widthFin;
        topSurface = this.lengthFin * this.widthFin;
        sideSurface = this.lengthFin * this.heightFin;

        // المساحة المرجعية تعتمد على زاوية الهجوم
        A = Math.abs(Math.cos(this.thetaZ) * frontSurface + Math.sin(this.thetaZ) * topSurface + Math.sin(this.thetaZ) * sideSurface);
        return A;
    }

    forceDragCylinder() {
        let Fdrag;

        Fdrag = 0.5 * this.p * this.v.len() * this.v.len() * this.getCdCylinder() * this.getACylinder(); // ......
        // return Fdrag;
        var vdir = this.v.norm();
        var dir = vdir.mult(-1);

        return dir.mult(Fdrag);
    }


    forceDragFin() {
        let Fdrag;

        // حساب قوة السحب
        Fdrag = 0.5 * this.p * this.v.len() * this.v.len() * this.getCdFin() * this.getAFin();

        // تحديد اتجاه قوة السحب
        var vdir = this.v.norm();
        var dir = vdir.mult(-1);

        // ضرب القوة في اتجاه السحب
        return dir.mult(Fdrag);
    }

    forceLiftCylinder() {
        let Flift;
        Flift = 0.5 * this.p * this.v.len() * this.v.len() * this.getClCylinder() * this.getACylinder();
        var vdir = this.v.norm();
        var dir = vdir.mult(-1)
        return dir.mult(Flift);
    }
    forceLiftFin() {
        let Flift;

        // حساب قوة الرفع
        Flift = 0.5 * this.p * this.v.len() * this.v.len() * this.getClFin() * this.getAFin();

        // تحديد اتجاه قوة الرفع
        var vdir = this.v.norm();
        var liftDir = new Vector(-vdir.z, vdir.y, vdir.x); // افتراض أن الرفع عمودي على اتجاه السرعة

        // ضرب القوة في اتجاه الرفع
        return liftDir.mult(Flift);
    }

    print() {
        console.log("X ll front" + this.fSpeed().X);
        console.log("y ll front" + this.fSpeed().y);
        console.log("z ll front" + this.fSpeed().z);

        console.log("==============");
        console.log("volAboveWater =====" + this.volAboveWater)
        console.table(this);


    }
}