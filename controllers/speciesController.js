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

exports.readAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        const [total, species] = await Promise.all([
            MarineSpecies.countDocuments(),
            MarineSpecies.find()
                .skip((page - 1) * limit)
                .limit(limit)
        ]);

        const totalPages = Math.ceil(total / limit);

        res.json({
            species,
            page,
            totalPages
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.readOne = async (req, res)=>{
    const species = await MarineSpecies.findById(req.params.id);
    res.json(species);
}
exports.update = async (req,res)=>{
    const updated = await MarineSpecies.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!updated) {
        return res.status(404).json({ message: 'Species not found' });
    }
    res.json(updated);
}
exports.Delete_id = async (req,res)=>{
    const deleted = await MarineSpecies.findByIdAndDelete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ message: 'Species not found' });
    }
    res.sendStatus(204);
    
}
