const router = require('express').Router();
const socController = require('./_controller/socController');


// create
router.post("/", async (req, res) => {
    const result = await socController.create(req);
    res.json(result);
    });


// list
router.get('/', async (req,res)=>{
    const result = await socController.list(req);
    res.json(result);
})


// update
router.put('/:id', async (req,res)=>{
    const result = await socController.update(req);
    res.json(result);
})

// delete
router.delete('/:id', async (req,res)=>{
    const result = await socController.delete(req);
    res.json(result);
})

// truncate, dummy insert
router.post('/reset', async (req,res)=>{
    const result = await socController.reset(req);
    res.json(result);
})

module.exports = router;