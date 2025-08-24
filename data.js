export {dataPlanets};
export {dataDwarfPlanets};

/*
    dataPlanets FORMAT
    [0] semiMajorAxis (AU)
    [1] eccentricity 
    [2] inclination (Radians)
    [3] longitudeOfAcendingNode (Radians)
    [4] argumentOfPeriapsis (Radians)
    [5] meanLongitude
    [6] COLOR;
    [7] Size (relative to earth)
    [8] Symbol (resource path)
    [9] Display Name


*/
const dataPlanets = [];
dataPlanets[0] = [
            38.7,
            0.205630,
            0.110828,
            0.843535,
            0.508309,
            0,
            0xADAAAC,
            0.3829,
            "./res/mercury.png",
            "Mercury",] //MERCURY
dataPlanets[1] = [
            72.3,
            0.006772,
            0.037524,
            1.338318,
            0.957906,
            0,
            0xDACC9A,
            0.9499,
            "./res/venus.png",
            "Venus",] //VENUS
dataPlanets[2] = [
            100,
            0.016708,
            0.027553,
            -0.196535,
            1.993302,
            0,
            0x00b1cd,
            1,
            "./res/earth.png",
            "Earth",] //EARTH
dataPlanets[3] = [
            152.3,
            0.0934,
            0.028448,
            0.865308,
            5.000368,
            0,
            0xf66754,
            0.533,
            "./res/mars.png",
            "Mars",] //MARS

dataPlanets[4] = [
            520.38,
            0.0489,
            0.005585,
            1.753427,
            4.779880,
            0,
            0xfb882b,
            11.209,
            "./res/jupiter.png",
            "Jupiter",] //JUPITER
dataPlanets[5] = [
            958.26,
            0.0565,
            0.016231,
            1.983828,
            5.923507,
            0,
            0xe9bb1e,
            9.449,
            "./res/saturn.png",
            "Saturn",] //Saturn
dataPlanets[6] = [
            2009.65,
            0.04717,
            0.017278,
            1.291648,
            1.692949,
            0,
            0x00e0db,
            4.007,
            "./res/uranus.png",
            "Uranus",] //Uranus
dataPlanets[7] = [
            3007,
            0.008678,
            0.012915,
            1.983828,
            2.300047,
            0,
            0x489eff,
            3.883,
            "./res/neptune.png",
            "Neptune",] //Neptune

const dataDwarfPlanets = [];
dataDwarfPlanets[0] = [
            277,
            0.0785,
            0.160570,
            1.401499,
            1.284562,
            0,
            0x6f6f6f,
            10,
            "./res/ceres.png",
            "Ceres",] //Ceres
dataDwarfPlanets[1] = [
            3948.2,
            0.2488,
            0.299498,
            1.925080,
            1.986778,
            0,
            0xbfbfbf,
            80,
            "./res/pluto.png",
            "Pluto",] //Pluto
dataDwarfPlanets[2] = [
            6786.4,
            0.43607,
            0.768643,
            0.627463,
            2.646599,
            0,
            0xbfbfbf,
            120,
            "./res/eris.png",
            "Eris",] //Eris
dataDwarfPlanets[3] = [
            50600,
            0.8496,
            0.208229,
            2.517602,
            5.434117,
            0,
            0xcf2f0f,
            500,
            "./res/sedna.png",
            "Sedna",] //Sedna
dataDwarfPlanets[4] = [
            3917.4,
            0.22701,
            0.35939,
            4.691428,
            3.624482,
            0,
            0x9f9f9f,
            125,
            "./res/orcus.png",
            "Orcus",] //Orcus
dataDwarfPlanets[5] = [
            4311.6,
            0.19642,
            0.492422,
            2.132216,
            4.172052,
            0,
            0xefefef,
            125,
            "./res/haumea.png",
            "Haumea",] //Haumea
dataDwarfPlanets[6] = [
            4543,
            0.16126,
            0.505857,
            1.389631,
            5.145824,
            0,
            0x9f9faf,
            125,
            "./res/makemake.png",
            "Makemake",] //Makemake
dataDwarfPlanets[7] = [
            6748.5,
            0.49943,
            0.534547,
            5.879269,
            3.624482,
            0,
            0xaf0a0c,
            250,
            "./res/gonggong.png",
            "Gonggong",] //Gonggong
                
/*
    dataPlanets FORMAT
    [0] semiMajorAxis (AU)
    [1] eccentricity 
    [2] inclination (Radians)
    [3] longitudeOfAcendingNode (Radians)
    [4] argumentOfPeriapsis (Radians)
    [5] meanLongitude
    [6] COLOR;
    [7] Size (relative to earth)
    [8] Symbol (resource path)
    [9] Display Name


*/
