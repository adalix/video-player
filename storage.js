class Storage{

    addNoteToStorage(note){
        let notes = this.getNoteFromStorage();
        notes.push(note)
        localStorage.setItem('notes', JSON.stringify(notes));

    }
    getNoteFromStorage(){
        let notes;
        if(localStorage.getItem('notes') === null){
            notes = []
        }else{
            notes = JSON.parse(localStorage.getItem('notes'))
        }
        return notes
    }
}

export default Storage;