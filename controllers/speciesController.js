const MarineSpecies = require("../model/MarineSpecies")

exports.create = async (req , res) =>{
    try{ 
     const species = new MarineSpecies(req.body);
     await species.save();
     res.status(201).json(species);   
        }
        catch(err){
            res.status(500).json({error: err.message});
        }
};

exports.readAll = async (req, res) =>{
    const list = await MarineSpecies.find();
    res.json(list);
}

exports.readOne = async (req, res)=>{
    const species = await MarineSpecies.findById(req.params.id);
    res.json(species);
}
exports.update = async (req, res) => {
    try {
        const updated = await MarineSpecies.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Species not found' });
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.Delete_id = async (req, res) => {
    try {
        const deleted = await MarineSpecies.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Species not found' });
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
