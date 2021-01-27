import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import Organization from './components/Organization';
import axios from 'axios';
import {
    TITLE,
    GET_ISSUES_OF_REPOSITORY,
    ADD_STAR_TO_REPOSITORY,
    REMOVE_STAR_FROM_REPOSITORY
} from './constants/index.js';

const axiosGitHubGraphQL = axios.create({
    baseURL: 'https://api.github.com/graphql',
    headers: {
        Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
    }
});

const getIssuesOfRepository = (path, cursor) => {
    const [organization, repository] = path.split('/');
    return axiosGitHubGraphQL.post('', {
        query: GET_ISSUES_OF_REPOSITORY,
        variables: { organization, repository, cursor }
    })
}

const resolveIssuesQuery= (queryResult, cursor) => (state) => {
    const { data, errors } = queryResult.data;
    if (!cursor) {
        return {
            organization: data.organization,
            errors
        }
    }

    const { edges: prevIssues } = state.organization.repository.issues;
    const { edges: newIssues } = data.organization.repository.issues;
    const updatedIssues = [...prevIssues, ...newIssues];

    return {
        organization: {
            ...data.organization,
            repository: {
                ...data.organization.repository,
                issues: {
                    ...data.organization.repository.issues,
                    edges: updatedIssues
                }
            }
        },
        errors: errors
    }
};

const addStarToRepository = (repositoryId) => {
    return axiosGitHubGraphQL.post('', {
        query: ADD_STAR_TO_REPOSITORY,
        variables: { repositoryId }
    })
}

const resolveAddStarMutation = (mutationResult) => (state) => {
    const { viewerHasStarred } = mutationResult.data.data.addStar.starrable;
    const { totalCount } = state.organization.repository.stargazers;
    return {
        organization: {
            ...state.organization,
            repository: {
                ...state.organization.repository,
                viewerHasStarred,
                stargazers: { totalCount: totalCount + 1 }
            }
        }
    }
}

const removeStarFromRepository = (repositoryId) => {
    return axiosGitHubGraphQL.post('', {
        query: REMOVE_STAR_FROM_REPOSITORY,
        variables: { repositoryId }
    })
}

const resolveRemoveStarMutation = (mutationResult) => (state) => {
    const { viewerHasStarred } = mutationResult.data.data.removeStar.starrable;
    const { totalCount } = state.organization.repository.stargazers;
    return {
        organization: {
            ...state.organization,
            repository: {
                ...state.organization.repository,
                viewerHasStarred,
                stargazers: { totalCount: totalCount - 1 }
            }
        }
    }
}

class App extends Component {
    state = {
        path: 'the-road-to-learn-react/the-road-to-learn-react',
        organization: null,
        errors: null,
    }

    componentDidMount() {
        this.onFetchFromGitHub(this.state.path);
    }

    onChange = (event) => {
        this.setState({ path: event.target.value });
    }

    onSubmit = (event) => {
        this.onFetchFromGitHub(this.state.path);
        event.preventDefault();
    }

    onFetchFromGitHub = async (path, cursor) => {
        try {
            let queryResult = await getIssuesOfRepository(path, cursor)
            this.setState(resolveIssuesQuery(queryResult, cursor))
        } catch (error) {
            console.error('Error fetching data.')
        }
    };

    onFetchMoreIssues = () => {
        const { endCursor } = this.state.organization.repository.issues.pageInfo;
        this.onFetchFromGitHub(this.state.path, endCursor);
    }

    onStarRepository = async (repositoryId, viewerHasStarred) => {
        if (viewerHasStarred) {
            try {
                let mutationResult = await removeStarFromRepository(repositoryId);
                this.setState(resolveRemoveStarMutation(mutationResult))          
            } catch (error) {
                console.error('Error mutating data.')
            }
        } else {
            try {
                let mutationResult = await addStarToRepository(repositoryId);
                this.setState(resolveAddStarMutation(mutationResult))          
            } catch (error) {
                console.error('Error mutating data.')
            }
        }
    }

    render() {
        const { path, organization, errors } = this.state;
        return (
            <>
                <h1>{ TITLE }</h1>
                <form onSubmit={ this.onSubmit }>
                    <label htmlFor="url">
                        Show open issues for https://github.com
                    </label>
                    <input
                        id="url"
                        type="text"
                        value={ path }
                        onChange={ this.onChange }
                        style={{ width: '300px' }}
                    />
                    <button type="submit">Search</button>
                </form>
                <hr />
                {
                    organization ? (
                        <Organization
                            organization={ organization }
                            errors={ errors }
                            onFetchMoreIssues={ this.onFetchMoreIssues }
                            onStarRepository={ this.onStarRepository }
                        />
                    ) : (
                        null
                    )
                }
            </>
        );        
    }
}

export default App;