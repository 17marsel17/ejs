
import express from 'express'
import {store, Book} from '../book.js'
import {storage} from '../middleware/file.js'
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

    console.log(book.fileBook[0].path);

    res.download(book.fileBook[0].path);
});

router.get('/', (req, res) => {
    const {books} = store;
    res.render('books/index', {
        title: "Список книг",
        books: books,
    });
});

router.get('/create', (req, res) => {
    res.render('books/create', {
        title: "Добавить книгу",
        book: {},
    })
});

router.get('/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const book = books.find(el => el.id === id);

    if (!book) {
        res.redirect('/404');
    }

    res.render("books/view", {
        title: "Просмотр книги",
        book: book,
    });

});

router.post('/create',  multer({storage: storage}).fields([{name: 'fileCover', maxCount: 1}, {name: 'fileBook', maxCount: 1}]),
    (req, res, next) => {
    const filedata = req.files['fileBook'];
    const imagedata = req.files['fileCover'];

    if (!filedata){
        res.json('Ошибка при загрузке файла');
        return;
    }

    const {books} = store;
    const {title, desc, authors, favority} = req.body;
    const fileName = filedata.originalname;

    const newBook = new Book(title, desc, authors, favority, imagedata, fileName, filedata);
    books.push(newBook);

    res.redirect('/api/books');
});

router.get('/update/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    }

    res.render('books/update', {
        title: "Редактирование книги",
        book: books[idx],
    });
});

router.post('/update/:id', multer({storage: storage}).fields([{name: 'fileCover', maxCount: 1}, {name: 'fileBook', maxCount: 1}]),
    (req, res) => {
    const {books} = store;
    const {title, desc} = req.body;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1){
        res.redirect('/404');
    }

    books[idx] = {
        ...books[idx],
        title,
        desc,
    };

    res.redirect(`/api/books/${id}`);
});

router.post('/delete/:id', (req, res) => {
    const {books} = store;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    }

    books.splice(idx, 1);
    res.redirect('/api/books');
});
