const dataControler = (() => {
  const data = {
    movies: [],
    programs: [],
    totalMoviesLength: 0
  };

  class Movie {
    constructor(title, length, genre) {
      this.title = title;
      this.length = length;
      this.genre = genre;
    }
    getInfo() {
      const genreAbbr = getGenreAbbreviation(this.genre);
      return `${this.title}, duration: ${this.length}min, genre: ${genreAbbr}`;
    }
  }

  class Program {
    constructor(date) {
      this.date = `${new Date(date).getDate()}. ${new Date(
        date
      ).getMonth()}. ${new Date(date).getFullYear()}.`;
      this.listOfMovies = [];
    }
  }

  function getGenreAbbreviation(genreStr) {
    const firstIndex = 0;
    const lastIndex = genreStr.length - 1;
    const output = genreStr.charAt(firstIndex) + genreStr.charAt(lastIndex);
    return output.toUpperCase();
  }

  function calculateTotalLength() {
    let total = 0;

    data.movies.forEach(currentMovie => (total += currentMovie.length));
    data.totalMoviesLength = total;
  }

  return {
    passData() {
      return data;
    },

    getTotalLength() {
      calculateTotalLength();

      return data.totalMoviesLength;
    },

    addMovie(title, length, genre) {
      const movie = new Movie(title, parseFloat(length), genre);

      data.movies.push(movie);

      return movie;
    },

    addProgram(date) {
      var program = new Program(date);

      data.programs.push(program);

      return program;
    }
  };
})();

const UIControler = (() => {
  const DOMStrings = Object.freeze({
    inputTitle: '.movie-title',
    inputLength: '.movie-length',
    selectGenre: 'genre-select',
    containerMovieList: '.movie-list',
    containerProgramList: '.program-list',
    containerMovieError: '.movie-error',
    containerProgramError: '.program-error',
    buttonAddMovie: '.create-movie',
    buttonAddProgram: '.create-program',
    buttonAddMovieToProgram: '.add-movie',
    formElement: 'form',
    containerTotalLength: '.total-length span',
    programDate: '.program-date',
    displayAddedMovie: 'movie-select',
    displayAddedProgram: 'program-select',
    displayMovieToProgram: '.movie-program-list'
  });

  function getDOMStrings() {
    return DOMStrings;
  }

  function collectMovieInput() {
    const titleElement = document.querySelector(DOMStrings.inputTitle);
    const lengthElement = document.querySelector(DOMStrings.inputLength);
    const genreSelectElement = document.getElementById(DOMStrings.selectGenre);

    return {
      title: titleElement.value,
      length: lengthElement.value,
      genre: genreSelectElement.value
    };
  }

  function collectProgramInput() {
    const dateElement = document.querySelector(DOMStrings.programDate);

    return {
      date: dateElement.value
    };
  }

  function displayMovieListItem(movie) {
    const containerForMovies = document.querySelector(
      DOMStrings.containerMovieList
    );

    var parag = document.createElement('p');
    var data = document.createTextNode(movie.getInfo());

    parag.appendChild(data);
    containerForMovies.appendChild(parag);
  }

  function displayProgramListItem(program) {
    const containerForPrograms = document.querySelector(
      DOMStrings.containerProgramList
    );

    var parag = document.createElement('p');
    var data = document.createTextNode(program.date);

    parag.appendChild(data);
    containerForPrograms.appendChild(parag);
  }

  function displayAddedMovie(data) {
    const movieSelectElement = document.getElementById(
      DOMStrings.displayAddedMovie
    );

    data.movies.forEach((e, i) => {
      var optionElement = document.createElement('option');
      var dataNode = document.createTextNode(e.title);

      optionElement.appendChild(dataNode);
      optionElement.setAttribute('value', i);
      movieSelectElement.appendChild(optionElement);
    });
  }

  function displayAddedProgram(data) {
    const programSelectElement = document.getElementById(
      DOMStrings.displayAddedProgram
    );

    data.programs.forEach((e, i) => {
      var optionElement = document.createElement('option');
      var dataNode = document.createTextNode(e.date);

      optionElement.appendChild(dataNode);
      optionElement.setAttribute('value', i);
      programSelectElement.appendChild(optionElement);
    });
  }

  function displayMovieError({ title, length, genre }) {
    let error = 'Unknown error';

    if (!title) {
      error = 'Please, insert title!';
    } else if (!length) {
      error = 'Please, insert length!';
    } else if (!genre) {
      error = 'Please, insert genre!';
    }

    let containerForError = document.querySelector(
      DOMStrings.containerMovieError
    );
    containerForError.textContent = error;
  }

  function displayProgramError() {
    let error = 'Insert date!';

    let containerForError = document.querySelector(
      DOMStrings.containerProgramError
    );
    containerForError.textContent = error;
  }

  function clearFormInputs() {
    document.querySelector(DOMStrings.formElement).reset();
    document.querySelector(DOMStrings.containerMovieError).textContent = '';
    document.querySelector(DOMStrings.containerProgramError).textContent = '';
  }

  function displayTotalLength(tLength = '-') {
    document.querySelector(
      DOMStrings.containerTotalLength
    ).textContent = String(tLength);
  }

  function resetMoviesField() {
    document.getElementById(DOMStrings.displayAddedMovie).innerHTML = '';
  }

  function resetProgramsField() {
    document.getElementById(DOMStrings.displayAddedProgram).innerHTML = '';
  }

  function joinMovieAndProgram(data) {
    const programSelectElement = document.getElementById(
      DOMStrings.displayAddedProgram
    );
    const movieSelectElement = document.getElementById(
      DOMStrings.displayAddedMovie
    );

    data.programs[programSelectElement.value].listOfMovies.push(
      data.movies[movieSelectElement.value]
    );
  }

  function renderMovieProgramJoint() {
    const movieField = document.getElementById(DOMStrings.displayAddedMovie);
    const movieFieldOption = movieField.options[movieField.selectedIndex];
    const programField = document.getElementById(
      DOMStrings.displayAddedProgram
    );
    const displayField = document.querySelector(
      DOMStrings.displayMovieToProgram
    );

    let paragElement = document.createElement('p');
    let result = `${movieFieldOption.textContent} has been added to: ${
      programField.textContent
    } program!`;
    let resultNode = document.createTextNode(result);

    paragElement.appendChild(resultNode);
    displayField.appendChild(paragElement);
  }

  return {
    getDOMStrings,
    displayTotalLength,
    clearFormInputs,
    displayMovieListItem,
    displayProgramListItem,
    displayMovieError,
    displayProgramError,
    displayAddedMovie,
    displayAddedProgram,
    resetMoviesField,
    resetProgramsField,
    joinMovieAndProgram,
    renderMovieProgramJoint,
    getMovieInput: collectMovieInput,
    getProgramInput: collectProgramInput
  };
})();

const mainControler = ((dataCtrl, UICtrl) => {
  function setupEventListeners() {
    const {
      buttonAddMovie,
      buttonAddProgram,
      buttonAddMovieToProgram
    } = UICtrl.getDOMStrings();

    document
      .querySelector(buttonAddMovie)
      .addEventListener('click', ctrlAddMovieItem);

    document.addEventListener('keydown', ({ keyCode }) => {
      if (keyCode === 13) {
        ctrlAddMovieItem();
      }
    });

    document
      .querySelector(buttonAddProgram)
      .addEventListener('click', ctrlAddProgramItem);

    document
      .querySelector(buttonAddMovieToProgram)
      .addEventListener('click', ctrlAddMovieToProgram);
  }

  function ctrlUpdateTotalLength() {
    const totalLength = dataCtrl.getTotalLength();

    UICtrl.displayTotalLength(totalLength);
  }

  function ctrlAddMovieItem() {
    const input = UICtrl.getMovieInput();

    //1.1 Validate data for errors
    if (!input.title || !input.genre || !input.length) {
      UICtrl.displayMovieError(input);
      return;
    }

    //2.  Add movie to list
    const movie = dataCtrl.addMovie(input.title, input.length, input.genre);

    //3. Clear form inputs
    UICtrl.clearFormInputs();

    //4. show list on UI
    UICtrl.displayMovieListItem(movie);

    //5. Update total length UI
    ctrlUpdateTotalLength();

    //6. Add movie to MOVIE/PROGRAM list bellow
    const data = dataCtrl.passData();

    // reset fields before rendering
    UICtrl.resetMoviesField();

    // render new list of movies
    UICtrl.displayAddedMovie(data);
  }

  function ctrlAddProgramItem() {
    //1. get form data
    const input = UICtrl.getProgramInput();

    //1.1 handle errors here
    if (!input.date) {
      UICtrl.displayProgramError(input);
      return;
    }

    //2. Add program to list
    const program = dataCtrl.addProgram(input.date);

    //3. Clear form input
    UICtrl.clearFormInputs();

    //4. show list on UI
    UICtrl.displayProgramListItem(program);

    //5. Add program to MOVIE/PROGRAM list bellow
    const data = dataCtrl.passData();

    // reset field before rendering
    UICtrl.resetProgramsField();

    // render new list of programs
    UICtrl.displayAddedProgram(data);
  }

  function ctrlAddMovieToProgram() {
    const data = dataCtrl.passData();

    UICtrl.joinMovieAndProgram(data);
    UICtrl.renderMovieProgramJoint();
  }

  return {
    init() {
      setupEventListeners();
      UICtrl.clearFormInputs();
    }
  };
})(dataControler, UIControler);

mainControler.init();

$('select.dropdown').dropdown();
