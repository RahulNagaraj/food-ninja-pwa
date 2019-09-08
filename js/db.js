// Offline data
// Sync with indexedDB
db.enablePersistence().catch(err => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open at once
    console.log('Persistence Failed');
  } else if (err.code === 'unimplemented') {
    // Lack of browser support
    console.log('Persistence is not available');
  }
});

// Real-time listener
db.collection('recipes').onSnapshot(snapshot => {
  // console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    // console.log('change: ', change, change.doc.data(), change.doc.id);
    if (change.type === 'added') {
      // Add document data to the
      renderRecipe(change.doc.data(), change.doc.id);
    } else if (change.type === 'removed') {
      // Remove the document from the list
    }
  });
});

// Add new recipe
const form = document.querySelector('form');

form.addEventListener('submit', evt => {
  evt.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  };

  db.collection('recipes')
    .add(recipe)
    .catch(err => console.log(err));

  form.title.value = '';
  form.ingredients.value = '';
});
