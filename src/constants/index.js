export const TITLE = 'React GraphQL GitHub Client';

export const GET_ISSUES_OF_REPOSITORY = `
    query ($organization: String!, $repository: String!, $cursor: String) {
        organization(login: $organization) {
            name
            url
            repository(name: $repository) {
                id
                name
                url
                viewerHasStarred
                issues(first: 5, after: $cursor, states: [OPEN]) {
                    edges {
                        node {
                            id
                            title
                            url
                            reactions(last: 3) {
                                edges {
                                    node {
                                        id
                                        content
                                    }
                                }
                            }
                        }
                    }
                    totalCount
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }
        }
    }
`;

export const ADD_STAR_TO_REPOSITORY = `
    mutation ($repositoryId: ID!) {
        addStar(input: {starrableId:$repositoryId}) {
            starrable {
                viewerHasStarred
            }
        }
    }
`;

export const REMOVE_STAR_FROM_REPOSITORY = `
    mutation ($repositoryId: ID!) {
        removeStar(input: {starrableId:$repositoryId}) {
            starrable {
                viewerHasStarred
            }
        }
    }
`;