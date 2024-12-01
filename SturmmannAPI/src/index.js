const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json())
const port = 3000;
mongoose.connect('mongodb+srv://silasmeira:e4z8KEGtEPaA0vtB@cluster0.sdl5j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const Word = mongoose.model('Word', { 
    name: String,
    definition1: String,
    definition2: String,
    synonyms: String,
    phrase1: String,
    phrase2: String,
});

app.get('/', async(req, res) => {
    const words = await Word.find()
    res.send(words)
})

app.post('/', async(req, res)=>{
    const word= new Word({
        name: req.body.name,
        definition1: req.body.definition1,
        definition2: req.body.definition2,
        synonyms: req.body.synonyms,
        phrase1: req.body.phrase1,
        phrase2: req.body.phrase2,
    })
    await word.save()
    res.send(word)
})

app.listen(port, () => {
    console.log(`App running`)
})
app.delete('/:id', async (req, res) => {
    try {
        const word = await Word.findByIdAndDelete(req.params.id);
        if (!word) {
            return res.status(404).send({ error: 'Word not found.' });
        }
        res.send({ message: 'Word deleted with success.' });
    } catch (error) {
        res.status(500).send({ error: 'Error deleting word.' });
    }
});

app.put('/:id', async (req, res) => {
    try {
        const word = await Word.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                definition1: req.body.definition1,
                definition2: req.body.definition2,
                synonyms: req.body.synonyms,
                phrase1: req.body.phrase1,
                phrase2: req.body.phrase2,
            },
            { new: true, runValidators: true }
        );

        if (!word) {
            return res.status(404).send({ error: 'Word not found.' });
        }
        
        return res.send(word);
    } catch (error) {
        res.status(500).send({ error: 'Error updating word.' });
    }
});
