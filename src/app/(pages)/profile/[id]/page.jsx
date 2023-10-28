export default function UserProfile({params}) {
    return (
        <div>
            <h1>Profile</h1>
            <hr />
            <p>{params.id}</p>
        </div>
    )
}