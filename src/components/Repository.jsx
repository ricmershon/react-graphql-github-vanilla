import ReactionList from './ReactionList';

const Repository = ({ repository, onFetchMoreIssues, onStarRepository }) => (
    <>
        <p>
            <strong>In Repository: </strong>
            <a href={ repository.url }>{ repository.name }</a>
        </p>
        <button
            type="button"
            onClick={() =>
                onStarRepository(repository.id, repository.viewerHasStarred)
            }
        >
            { repository.stargazers.totalCount }
            { repository.viewerHasStarred ? ' Unstar' : ' Star' }
        </button>
        <ul>
            {
                repository.issues.edges.map(issue => (
                    <li key={ issue.node.id }>
                        <a href={ issue.node.url }>{ issue.node.title }</a>
                        <ReactionList reactions={ issue.node.reactions } />
                    </li>
                ))
            }
        </ul>
        <hr />
        {
            repository.issues.pageInfo.hasNextPage && 
            <button onClick={ onFetchMoreIssues }>More</button>
        }
    </>
)

export default Repository;