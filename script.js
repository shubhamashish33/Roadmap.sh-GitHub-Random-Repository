
const languageDropdown = document.getElementById('language-dropdown');
const repositoriesContainer = document.getElementById('repositories');

fetch('https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json')
.then(response => response.json())
.then(data => {
    data.forEach(language => {
        const option = document.createElement('option');
        option.value = language.value;
        option.textContent = language.title;
        languageDropdown.appendChild(option);
    });
})
.catch(error => {
    console.error('Error fetching languages:', error);
});

languageDropdown.addEventListener('change', async () => {
    const selectedLanguage = languageDropdown.value;
    repositoriesContainer.innerHTML = '';

    if (selectedLanguage) {
        repositoriesContainer.innerHTML = '<p>Loading, Please Wait...</p>';

        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=${selectedLanguage}`);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                displayRepositories(data.items);
            } else {
                repositoriesContainer.innerHTML = '<p>No repositories found for this language.</p>';
            }
        } catch (error) {
            repositoriesContainer.innerHTML = `<p>Error fetching repositories: ${error.message}</p>`;
        }
    }
});

function displayRepositories(repositories) {
    repositoriesContainer.innerHTML = '';

    repositories.forEach(repository => {
        const repoElement = document.createElement('div');
        repoElement.classList.add('repository');

        const repoName = document.createElement('h3');
        repoName.textContent = repository.name;

        const repoDescription = document.createElement('p');
        repoDescription.textContent = repository.description || 'No description provided';

        repoElement.appendChild(repoName);
        repoElement.appendChild(repoDescription);

        repositoriesContainer.appendChild(repoElement);
    });
}