import DashboardLayout from "../../../components/DashboardLayout.jsx";
import PageHeader from "../../../components/PageHeader.jsx";
import ProfessorNovaPanel from "./ProfessorNovaPanel.jsx";

export default function ExperimentIntro({ experiment, onBegin }) {
  const intro = experiment.intro ?? {
    professor: "Professor Nova",
    title: experiment.title,
    message: experiment.description,
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow={experiment.topic}
        title={experiment.title}
        description={experiment.description}
      />

      <ProfessorNovaPanel
        mood="excited"
        title={intro.professor}
        subtitle={intro.title}
        message={intro.message}
      />

      <section className="card">
        <h2>Equipment</h2>

        <div className="science-equipment-grid">
          {experiment.equipment.map((item, index) => {
            const name = typeof item === "string" ? item : item.name;
            const icon = typeof item === "string" ? "🧪" : item.icon;

            return (
              <div
                key={`${experiment.id}-${name}-${index}`}
                className="science-equipment-card"
              >
                <div className="science-equipment-icon">{icon}</div>
                <p>{name}</p>
              </div>
            );
          })}
        </div>
      </section>

      <button className="primary-button" onClick={onBegin}>
        Begin Experiment
      </button>
    </DashboardLayout>
  );
}