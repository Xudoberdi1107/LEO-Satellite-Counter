import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { orbitsType } from "./App";
import "./SelectOrbits.css";

type SelectOrbitsProps = {
    setOrbitsAndSatellites: Dispatch<SetStateAction<orbitsType[]>>;
    orbitsAndSatellites: orbitsType[];
};

function SelectOrbits(props: SelectOrbitsProps) {
    const { setOrbitsAndSatellites, orbitsAndSatellites } = props;

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    const handleChange = (index: number, field: keyof orbitsType, value: number | string) => {
        const updated = [...orbitsAndSatellites];
        updated[index] = {
            ...updated[index],
            [field]: field === "count" || field === "inclination" || field === "radius"
                ? Number(value)
                : value,
        };
        setOrbitsAndSatellites(updated);
    };

    // Orbitani o'chirish funktsiyasi
    const removeOrbit = (index: number) => {
        const updated = orbitsAndSatellites.filter((_, i) => i !== index);
        setOrbitsAndSatellites(updated);
    };

    // Yangi orbit qo'shish funktsiyasi
    const addOrbit = () => {
        const newOrbit: orbitsType = {
            count: 1,
            inclination: 0,
            radius: 100,
            color: "#ffffff"
        };
        setOrbitsAndSatellites([...orbitsAndSatellites, newOrbit]);
    };

    return (
        <div className="SelectOrbitsContainer">
            <button className="toggleButton" onClick={toggleMenu}>
                {isOpen ? "Menyuni Yopish" : "Menyuni Ochish"}
            </button>

            {isOpen && (
                <div className="SelectOrbits">
                    <h3>Orbitalar</h3>
                    <hr />
                    <button
                        className="toggleButton"
                        style={{ marginBottom: "15px", background: "#27ae60" }}
                        onClick={addOrbit}
                    >
                        Orbita Qo‘shish
                    </button>

                    <div className="scroll">
                        <div className="orbits">
                            {orbitsAndSatellites.map(({ color, count, inclination, radius }, index) => (
                                <div className="orbit" key={index}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h4>Orbit {index + 1}</h4>
                                        <button
                                            onClick={() => removeOrbit(index)}
                                            style={{
                                                background: "#e74c3c",
                                                border: "none",
                                                borderRadius: "50%",
                                                color: "white",
                                                width: "25px",
                                                height: "25px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                lineHeight: "20px",
                                                textAlign: "center",
                                            }}
                                            title="Orbitani o‘chirish"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="value">
                                        <label htmlFor={`count-${index}`}>Yo‘ldosh soni (count)</label>
                                        <input
                                            type="number"
                                            id={`count-${index}`}
                                            value={count}
                                            onChange={(e) => handleChange(index, "count", e.target.value)}
                                        />
                                    </div>
                                    <hr />
                                    <div className="value">
                                        <label htmlFor={`inclination-${index}`}>Inclination (°)</label>
                                        <input
                                            type="number"
                                            id={`inclination-${index}`}
                                            value={inclination}
                                            onChange={(e) => handleChange(index, "inclination", e.target.value)}
                                        />
                                    </div>
                                    <hr />
                                    <div className="value">
                                        <label htmlFor={`radius-${index}`}>Radius</label>
                                        <input
                                            type="number"
                                            id={`radius-${index}`}
                                            value={radius}
                                            onChange={(e) => handleChange(index, "radius", e.target.value)}
                                        />
                                    </div>
                                    <hr />
                                    <div className="value">
                                        <label htmlFor={`color-${index}`}>Rang</label>
                                        <input
                                            type="color"
                                            id={`color-${index}`}
                                            value={color}
                                            onChange={(e) => handleChange(index, "color", e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SelectOrbits;
