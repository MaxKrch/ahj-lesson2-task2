const namePoles = ["id", "title", "imdb", "year"];

export default class Sorting {
	constructor(container, list) {
		this.container = document.querySelector(container);
		this.films = null;
		this.tableFilms = null;
		this.namePoles = namePoles;

		this.loadFilms(list);
		this.renderTableFilms();
		this.renderListFilms();
		this.startSorting();
	}

	loadFilms(list) {
		const films = JSON.parse(list);
		this.films = films;
	}

	startSorting() {
		setInterval(() => {
			this.changeItemForSort();
		}, 1000);
	}

	changeItemForSort() {
		let oldSort = this.activeSort;

		if (oldSort) {
			if (oldSort[1] === "down") {
				const oldItemSort = oldSort[0];
				const indexOldItemSort = this.namePoles.indexOf(oldItemSort);
				const countPoles = this.namePoles.length;
				let newIndex = indexOldItemSort + 1;

				if (newIndex >= countPoles) {
					newIndex = 0;
				}

				const newItemSort = this.namePoles[newIndex];

				this.activeSort = [newItemSort, "up"];
			} else {
				this.activeSort[1] = "down";
			}
		} else {
			this.activeSort = [this.namePoles[0], "up"];
		}

		this.changeActiveTitle();

		this.activeSort[0] === "title" ? this.sortByName() : this.sortByNumber();
	}

	sortByName() {
		const listFilms = this.extractionData();

		const newSortFilms = listFilms.sort((a, b) => {
			if (a.title.toLowerCase() > b.title.toLowerCase()) {
				return 1;
			}

			if (a.title.toLowerCase() < b.title.toLowerCase()) {
				return -1;
			}

			return 0;
		});

		this.upgradeTableFilms(newSortFilms);
	}

	sortByNumber() {
		const listFilms = this.extractionData();
		const itemForSort = this.activeSort[0];
		const newSortFilms = listFilms.sort((a, b) => {
			return +a[itemForSort] - +b[itemForSort];
		});

		this.upgradeTableFilms(newSortFilms);
	}

	upgradeTableFilms(newList) {
		if (this.activeSort[1] === "down") {
			newList = newList.reverse();
		}

		let i = 0;
		for (let film of this.films) {
			if (+film.id != +newList[i].id) {
				const newFilm = this.renderFilm(newList[i]);
				const oldFilm = this.container.querySelector(`[data-id='${film.id}']`);

				oldFilm.replaceWith(newFilm);
			}
			i += 1;
		}

		this.films = newList;
	}

	extractionData() {
		const listFilms = [];
		const filmsFromDOM = this.container.querySelectorAll(".table-film");

		for (let film of filmsFromDOM) {
			const newFilm = {};

			for (let key in film.dataset) {
				let value = film.dataset[key];
				if (key !== "title") {
					value = Number(value);
				}
				newFilm[key] = value;
			}

			listFilms.push(newFilm);
		}

		return listFilms;
	}

	renderTableFilms() {
		const table = document.createElement("table");
		const rowTitles = document.createElement("tr");

		table.classList.add("table");
		rowTitles.classList.add("table-title");

		let title = "";
		for (let item of this.namePoles) {
			title += `<th class="table-title-cell ${item}">${item}</th>`;
		}

		rowTitles.innerHTML = title;

		table.append(rowTitles);
		this.tableFilms = table;
		this.container.append(table);
	}

	renderListFilms() {
		for (let film of this.films) {
			const newFilm = this.renderFilm(film);
			this.tableFilms.append(newFilm);
		}
	}

	renderFilm(film) {
		const newFilm = document.createElement("tr");
		newFilm.classList.add("table-film");

		for (let key in film) {
			let value = film[key];
			newFilm.dataset[key] = value;

			if (key === "imdb") {
				value = +value;
				value = value.toFixed(2);
			}

			newFilm.innerHTML += `<td class=table-film-cell>${value}</td>`;
		}

		return newFilm;
	}

	changeActiveTitle() {
		const oldSortDirection = this.activeSort[1] === "up" ? "down" : "up";
		const activeTitle = this.container.querySelector(`
			.sorting-${oldSortDirection}
		`);

		if (activeTitle) {
			activeTitle.classList.remove(`sorting-${oldSortDirection}`);
		}

		const title = this.activeSort[0];
		const th = this.container.querySelector(`.${title}`);
		th.classList.add(`sorting-${this.activeSort[1]}`);
	}
}
