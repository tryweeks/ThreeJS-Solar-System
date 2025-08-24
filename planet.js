export class Planet {
    constructor(sunMass){
        this.sunMass = sunMass;

        this.semiMajorAxis;
        this.eccentricity;
        this.inclination;
        this.longitudeOfAcendingNode;
        this.argumentOfPeriapsis;
        this.meanLongitude;

        this.mu;
        this.n;
        this.trueAnomalyConstant;
        this.cosLOAN;
        this.sinLOAN;
        this.cosI;
        this.sinI;
        this.sunMass;

        this.G = 6.674;
        this.maxIterations = 4;
        this.accuracyTolerance = 1e-6;
        this.color;
    }

    set color(col){
        this.col = col;
    }

    setOrbitalElements(a,e,i,n,w,L){
        this.semiMajorAxis = a; //Size a
        this.eccentricity = e; //Shape e
        this.inclination = i; //Tilt i
        this.longitudeOfAcendingNode = n; //Swivel n
        this.argumentOfPeriapsis = w; //Position w
        this.meanLongitude = L; //Offset L
    }

    setOrbitalElementsJSON({semiMajorAxis,eccentricity,inclination,longitudeOfAcendingNode,argumentOfPeriapsis,meanLongitude}){
        this.semiMajorAxis = semiMajorAxis; //Size a
        this.eccentricity = eccentricity; //Shape e
        this.inclination = inclination; //Tilt i
        this.longitudeOfAcendingNode = longitudeOfAcendingNode; //Swivel n
        this.argumentOfPeriapsis = argumentOfPeriapsis; //Position w
        this.meanLongitude = meanLongitude; //Offset L
    }

    calculateSemiConstants(){
        this.mu = this.G * this.sunMass;
        this.n = Math.sqrt(this.mu / Math.pow(this.semiMajorAxis,3));
        this.trueAnomalyConstant = Math.sqrt((1 + this.eccentricity) / (1 - this.eccentricity));
        this.cosLOAN = Math.cos(this.longitudeOfAcendingNode);
        this.sinLOAN = Math.sin(this.longitudeOfAcendingNode);
        this.cosI = Math.cos(this.inclination);
        this.sinI = Math.sin(this.inclination);
       
    }

    calculateOrbitLine(divisions){
        let TAU = Math.PI*2.0;
        let positions = [];
        let colors = [];
        const r = 128;
        const PI3 = TAU * 0.33333;
        let orbitalFraction = 1.0/divisions;
        let pii = TAU/divisions;
        for ( let i = 0; i < divisions +1; i++ ) {
    
            let EA = i * orbitalFraction * TAU; //eccentric anomaly
    
            let TA = 2 * Math.atan(this.trueAnomalyConstant * Math.tan(EA / 2.0)); //true anomaly
            let D = this.semiMajorAxis * (1.0 - this.eccentricity * Math.cos(EA));
            let cosTA = Math.cos(this.argumentOfPeriapsis + TA);
            let sinTA = Math.sin(this.argumentOfPeriapsis + TA);
    
            let X = D *((this.cosLOAN * cosTA) - (this.sinLOAN * sinTA * this.cosI));
            let Z = D * ((this.sinLOAN * cosTA) + (this.cosLOAN * sinTA * this.cosI));
            let Y = D * (this.sinI * sinTA);

            positions.push( X, Y, Z);
        
            //color.setHSL( t, 1.0, 0.5 );
            colors.push( (Math.sin(pii*i)*0.5+0.5));
            colors.push( (Math.sin(pii*i+PI3)*0.5+0.5));
            colors.push( (Math.sin(pii*i+PI3+PI3)*0.5+0.5));
        }
    
        let attr = [];
        attr[0] = positions;
        attr[1] = colors;
        return attr;
        //lineGeometry.setFromPoints(positions);
        //lineGeometry.setAttributes('positions');
    }

    calculateOrbitLineColor(divisions,R,G,B){
        let TAU = Math.PI*2.0;
        let positions = [];
        let colors = [];
        const PI3 = TAU * 0.33333;
        let orbitalFraction = 1.0/divisions;
        let pii = TAU/divisions;
        for ( let i = 0; i < divisions +1; i++ ) {
    
            let EA = i * orbitalFraction * TAU; //eccentric anomaly
    
            let TA = 2 * Math.atan(this.trueAnomalyConstant * Math.tan(EA / 2.0)); //true anomaly
            let D = this.semiMajorAxis * (1.0 - this.eccentricity * Math.cos(EA));
            let cosTA = Math.cos(this.argumentOfPeriapsis + TA);
            let sinTA = Math.sin(this.argumentOfPeriapsis + TA);
    
            let X = D *((this.cosLOAN * cosTA) - (this.sinLOAN * sinTA * this.cosI));
            let Z = D * ((this.sinLOAN * cosTA) + (this.cosLOAN * sinTA * this.cosI));
            let Y = D * (this.sinI * sinTA);

            positions.push( X, Y, Z);
        
            //color.setHSL( t, 1.0, 0.5 );
            let brightness = Math.sin(pii*i*4)*0.25+0.75;
            colors.push(R*brightness);
            colors.push(G*brightness);
            colors.push(B*brightness);
        }
    
        let attr = [];
        attr[0] = positions;
        attr[1] = colors;
        return attr;
        //lineGeometry.setFromPoints(positions);
        //lineGeometry.setAttributes('positions');
    }

    caluclateOrbitalPosition(time){
        function F(E, e, M){
            return M - E + e * Math.sin(E);
        }
        
        function DF(E, e){
            return (-1.0) + e * Math.cos(E);
        }

        let meanAnomaly = this.n * (time - this.meanLongitude);

        //Keplers equation
        let E1 = meanAnomaly;
        let difference = 1.0;
        for(let i = 0; difference > this.accuracyTolerance && i < this.maxIterations; i++)
        {
            let E0 = E1;
            E1 = E0 - F(E0, this.eccentricity, meanAnomaly) / DF(E0,this.eccentricity);
            difference = Math.abs(E1 - E0);
        }
        let eccentricAnomaly = E1;
        let trueAnomaly = 2 * Math.atan(this.trueAnomalyConstant * Math.tan(eccentricAnomaly / 2.0));
        let distance = this.semiMajorAxis * (1 - this.eccentricity * Math.cos(eccentricAnomaly));

        let cosAOPPlusTA = Math.cos(this.argumentOfPeriapsis + trueAnomaly);
        let sinAOPPlusTA = Math.sin(this.argumentOfPeriapsis + trueAnomaly);

        let x = distance * ((this.cosLOAN * cosAOPPlusTA) - (this.sinLOAN * sinAOPPlusTA * this.cosI));
        let z = distance * ((this.sinLOAN * cosAOPPlusTA) + (this.cosLOAN * sinAOPPlusTA * this.cosI));      //Switching z and y to be aligned with xz not xy
        let y = distance * (this.sinI * sinAOPPlusTA);
        let pos = [x,y,z];
        return pos;
    }
    
};