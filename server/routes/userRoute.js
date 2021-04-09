var express = require('express');
var router = express.Router();

let Trap = require('../models/Trap');
let bisec = require('../models/bisec');
let falsee = require('../models/falsee');
let newton = require('../models/newton');
let secentt = require('../models/secentt');
let onepoint = require('../models/onepoint');

let trapcomposite = require('../models/trapcomposite');
let simples = require('../models/simples');
let compusitesim = require('../models/compusitesim');
let Forwardh = require('../models/Forwardh');

/* GET users listing. */

/////////////////////////////////////////////////////////////

router.get('/showtrap', function(req, res, next) {
 
  Trap.find().sort({age:1}).exec((err,data)=>{
    console.log(data);
    return res.json({success:true,data:data});
  })

});


router.post('/trap',(req,res)=>{
  console.log(req.body);
  let doc = new Trap(req.body);
  doc.save((err,data)=>{
    if(err) throw err;
    res.send({success:true});
  })
})
router.get('/showbisec', function(req, res, next) {
  try{
    bisec.find().sort({age:1}).exec((err,data)=>{
      console.log(data);
      return res.json({success:true,data:data});
    })
  }
  catch(e){
    console.log(e)
  }

});


router.post('/addbisec',(req,res)=>{
  console.log(req.body);
  let doc = new bisec(req.body);
  doc.save((err,data)=>{
    if(err) throw err;
    res.send({success:true});
  })
})
router.get('/showfalsee', function(req, res, next) {
 
  falsee.find().sort({age:1}).exec((err,data)=>{
    console.log(data);
    return res.json({success:true,data:data});
  })

});


router.post('/falsee',(req,res)=>{
  console.log(req.body);
  let doc = new falsee(req.body);
  doc.save((err,data)=>{
    if(err) throw err;
    res.send({success:true});
  })
})

router.get('/shownewtonn', function(req, res, next) {
 
  newton.find().sort({age:1}).exec((err,data)=>{
    console.log(data);
    return res.json({success:true,data:data});
  })

});


router.post('/newton',(req,res)=>{
  console.log(req.body);
  let doc = new newton(req.body);
  doc.save((err,data)=>{
    if(err) throw err;
    res.send({success:true});
  })
})
router.get('/showsecentt', function(req, res, next) {
 
  secentt.find().sort({age:1}).exec((err,data)=>{
    console.log(data);
    return res.json({success:true,data:data});
  })

});


router.post('/secentt',(req,res)=>{
  console.log(req.body);
  let doc = new secentt(req.body);
  doc.save((err,data)=>{
    if(err) throw err;
    res.send({success:true});
  })
})

router.get('/showonepoint', function(req, res, next) {
 
  onepoint.find().sort({age:1}).exec((err,data)=>{
    console.log(data);
    return res.json({success:true,data:data});
  })

});


router.post('/onepoint',(req,res)=>{
  console.log(req.body);
  let doc = new onepoint(req.body);
  doc.save((err,data)=>{
    if(err) throw err;
    res.send({success:true});
  })
})

router.get('/showtrapcomposite', function(req, res, next) {
 
  trapcomposite.find().sort({age:1}).exec((err,data)=>{
    console.log(data);
    return res.json({success:true,data:data});
  })

});


router.post('/trapcomposite',(req,res)=>{
  console.log(req.body);
  let doc = new trapcomposite(req.body);
  doc.save((err,data)=>{
    if(err) throw err;
    res.send({success:true});
  })
})

router.get('/showsimples', function(req, res, next) {
 
  simples.find().sort({age:1}).exec((err,data)=>{
    console.log(data);
    return res.json({success:true,data:data});
  })

});


router.post('/simples',(req,res)=>{
  console.log(req.body);
  let doc = new simples(req.body);
  doc.save((err,data)=>{
    if(err) throw err;
    res.send({success:true});
  })
})

router.get('/showcompusitesim', function(req, res, next) {
 
  compusitesim.find().sort({age:1}).exec((err,data)=>{
    console.log(data);
    return res.json({success:true,data:data});
  })

});


router.post('/compusitesim',(req,res)=>{
  console.log(req.body);
  let doc = new compusitesim(req.body);
  doc.save((err,data)=>{
    if(err) throw err;
    res.send({success:true});
  })
})

router.get('/showForwardh', function(req, res, next) {
 
  Forwardh.find().sort({age:1}).exec((err,data)=>{
    console.log(data);
    return res.json({success:true,data:data});
  })

});


router.post('/Forwardh',(req,res)=>{
  console.log(req.body);
  let doc = new Forwardh(req.body);
  doc.save((err,data)=>{
    if(err) throw err;
    res.send({success:true});
  })
})

/////////////////////////////////////////////////////////////

module.exports = router;
