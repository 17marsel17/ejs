
import express from 'express'
import {store, Book} from '../book.js'
import {storage, fileFilter} from '../middleware/file.js'
import multer from 'multer'

export const router = express.Router();

router.get('/:id/download', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const book = books.find(el => el.id === id);

    if (!book) {
        res.status(404);
        res.json('404 | страница не найдена');
        
        return;
    }

    res.download(book.fileBook.path);
});

router.get('/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const book = books.find(el => el.id === id);

    if (!book) {
        res.status(404);
        res.json('404 | страница не найдена');

        return;
    }

    res.json(book);
});

router.get('/', (req, res) => {
    const {books} = store;
    res.json(books);
});

router.use(multer({storage: storage, fileFilter: fileFilter}).single('book-name'));
router.post('/', (req, res, next) => {
    const filedata = req.file;
    if (!filedata){
        res.json('Ошибка при загрузке файла');
        return;
    }

    const {books} = store;
    const {title, desc, authors, favority, fileCover} = req.body;
    const fileName = filedata.originalname;

    const newBook = new Book(title, desc, authors, favority, fileCover, fileName, filedata);
    books.push(newBook);

    res.status(201);

    res.json('Файл загружен');
});

router.put('/:id', (req, res) => {
    const {books} = store;
    const {title, desc, authors, favorite, fileCover, fileName} = req.body;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1){
        books[idx] = {
            ...books[idx],
            title,
            desc,
            authors,
            favorite,
            fileCover,
            fileName
        };

        console.log(books[idx]);

        res.json(books[idx]);
    } else {
        res.status(404);
        res.json('404 | страница не найдена');
    }
});

router.delete('/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.status(404);
        res.json('404 | страница не найдена');
        return;
    }

    books.splice(idx, 1);
    res.json('ok');
});
