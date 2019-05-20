module.exports = function(app, db) {
    var ObjectID = require('mongodb').ObjectID;

    /* GET New User page. */
    app.get('/', function(req, res) {
        res.render('welcomeJade');
    });

    app.get('/noteList', async function(req, res) {
        try {
            var doc = await db.collection('Notes').find().toArray();
            //var doc = await db.collection('UserCollection').find().toArray();
            res.render('noteListJade', {
                "noteList": doc
            });
        } catch (err) {
            console.log('get all failed');
            console.error(err);
        }
    });

    /* GET New User page. */
    app.get('/newNote', function(req, res) {
        res.render('newNoteJade', { title: 'Add New Note' });
    });

    app.post('/addNote', (req, res) => {
        const note = {
            Subject: req.body.Subject,
            Priority: req.body.Priority,
            Description: req.body.Description

            //username: req.body.username,
            //email: req.body.useremail
        };
        db.collection('Notes').insertOne(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.redirect("noteList");
            }
        });
    });

    // form to let user enter name to get details
    app.get('/noteBySubject/', function(req, res) {
        res.render('noteBySubjectJade', { title: 'Search data by note subject' });
    });

    app.post('/findNote', (req, res) => {
        const details = { Subject: req.body.noteSubject };
        db.collection('Notes').findOne(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred :(' });
            } else {
                console.log(item);
                if (item == null) { // if there is no such name, don;t just crash the client side code
                    item = { Subject: 'no such note', Description: "", Priority: "" }
                }
                res.render('noteDetailJade', {
                    "noteDetail": item
                });
            }
        });
    });

    app.delete('/deleteNote/:bid', (req, res) => {
        const theSubject = req.params.bid;
        console.log(theSubject);
        //const details = { '_id': new ObjectID(id) };  not using the _id
        const which = { 'Subject': theSubject }; // delete by subject
        db.collection('Notes').deleteOne(which, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred :(' });
            } else {
                res.send('Note ' + theSubject + ' deleted!');
            }
        });
    });

    app.put('/updateNote/:id', (req, res) => {
        const what_id = req.params.id;
        const note = req.body;
        const newSubject = note.Subject;
        const newDescription = note.Description;
        const newPriority = note.Priority
            //const details = { '_id': new ObjectID(who_id) };  // not going to try and update by _id
            // wierd bson datatype add complications

        // if uddating more than one field: 
        //db.collection('UserCollection').updateOne({ username: who_id }, { $set: { "email": newEmail, "title": newTitle } }, (err, result) => {

        // updating just email using name as key
        db.collection('Notes').updateOne({ Subject: what_id }, { $set: { "Subject": newSubject, "Description": newDescription, "Priority": newPriority } }, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(note);
            }
        });
    });

    //===============================================================================
    //===============================================================================
    //===============================================================================
    //  grouping a set of calls within a URL /name/  /admin/
    // GET default admin with no path
    app.get('/admin/', function(req, res) {
        res.send('Hello from admin route head');
    });

    /* GET admin time. */
    app.get('/admin/gettime', function(req, res) {
        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/" +
            (currentdate.getMonth() + 1) + "/" +
            currentdate.getFullYear() + " @ " +
            currentdate.getHours() + ":" +
            currentdate.getMinutes() + ":" +
            currentdate.getSeconds();
        res.render('gettimeJade', {
            "time": datetime
        });
    });



    //  a(href='/echo/dog') echo /
    app.get('/echo/:id', function(req, res) {
        const value = req.params.id;
        res.send(value); // value = dog
    });



}; // end of mod exports