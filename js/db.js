// Real-time listener
db.collection('recipes').onSnapshot(snapshot => {
  // console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    // console.log('change: ', change, change.doc.data(), change.doc.id);
    if (change.type === 'added') {
      // Add document data to the list
    } else if (change.type === 'removed') {
      // Remove the document from the list
    }
  });
});
