import React, { useState } from "react";
import "../css/SkillsInput.css";

const SkillsInput = ({ skills, setSkills }) => {
  const [input, setInput] = useState("");

  const addSkill = () => {
    if (input.trim() && !skills.includes(input.trim())) {
      setSkills([...skills, input.trim()]); // Add unique skill
      setInput(""); // Clear input
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="skills-input-container">
      {/* Dynamic class to handle margin */}
      <div className={`skills-list ${skills.length === 0 ? "empty" : ""}`}>
        {skills.map((skill, index) => (
          <span key={index} className="skill-chip">
            {skill}
            <button type="button" onClick={() => removeSkill(skill)}>
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addSkill();
          }
        }}
        placeholder="Type a skill and press Enter"
      />
      <button type="button" onClick={addSkill}>
        Add Skill
      </button>
    </div>
  );
};

export default SkillsInput;
