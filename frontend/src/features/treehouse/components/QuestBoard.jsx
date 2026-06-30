export default function QuestBoard({ quest }) {

    if (!quest)
        return (
            <div className="card">
                Loading quest...
            </div>
        );

    return (
        <div className="card">

            <h2>📖 Today's Adventure</h2>

            <h3>{quest.title}</h3>

            <p>{quest.realm}</p>

            <button>

                Begin Adventure

            </button>

        </div>
    );

}