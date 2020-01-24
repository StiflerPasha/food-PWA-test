// offline data
db.enablePersistence().catch(err => {
  if (err.code === 'failed-precondition') {
    console.log('persistance failed');
  } else if (err.code === 'unimplemented') {
    console.log('persistance is not avalible');
  }
});
// real-time listener
db.collection('recipes').onSnapshot(snapshot => {
  // console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    // console.log(change, change.doc.data(), change.doc.data());
    if (change.type === 'added') {
      renderRecipe(change.doc.data(), change.doc.id);
    }
    if (change.type === 'removed') {
      removeRecipe(change.doc.id);
    }
  });
});

// add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
  evt.preventDefault();

  const recipe = {
    title: form.title.value,
    ingridients: form.ingridients.value,
  };

  db.collection('recipes')
    .add(recipe)
    .catch(err => console.log(err));

  form.title.value = '';
  form.ingridients.value = '';
});

// delete a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
  // console.log(evt);
  if (evt.target.tagName === 'I') {
    const id = evt.target.getAttribute('data-id');
    db.collection('recipes')
      .doc(id)
      .delete();
  }
});
