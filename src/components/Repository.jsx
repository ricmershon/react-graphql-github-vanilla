import ReactionList from './ReactionList';

const Repository = ({ repository, onFetchMoreIssues }) => (
    <div>
        <p>
            <strong>In Repository: </strong>
            <a href={ repository.url }>{ repository.name }</a>
        </p>
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
    </div>
)

export default Repository;