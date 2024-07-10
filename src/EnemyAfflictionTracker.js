import React, { useState, useEffect } from 'react';

const afflictionList = [
  "stuttering", "lovers", "agoraphobia", "anorexia", "claustrophobia", "confusion",
  "dizziness", "epilepsy", "generosity", "loneliness", "masochism", "pacifism",
  "recklessness", "shyness", "stupidity", "vertigo", "airdisrupt", "firedisrupt",
  "waterdisrupt", "paranoia", "dementia", "hallucinations", "paralysis", "asthma",
  "slickness", "impatience", "torso", "rightarm", "leftarm", "rightleg", "leftleg", "head",
  "tenderskin", "spiritburn", "spiritdisrupt", "earthdisrupt", "hypersomnia", "timeloop",
  "sandfever", "fulminated", "pyramides", "flushings", "darkshade", "haemophilia", "lethargy",
  "nausea", "scytherus"
];

const cureTypes = {
  eaten: {
    "piece of kelp": ["asthma", "clumsiness", "hypochondria", "sensitivity", "weariness", "healthleech", "parasite"],
    "lobelia seed": ["tenderskin", "spiritburn", "agoraphobia", "claustrophobia", "loneliness", "masochism", "recklessness", "vertigo", "spiritdisrupt", "airdisrupt", "earthdisrupt", "firedisrupt", "waterdisrupt"],
    "prickly ash bark": ["confusion", "dementia", "hallucinations", "hypersomnia", "paranoia"],
    "bellwort flower": ["timeloop", "generosity", "pacifism", "justice", "lovers"],
    "goldenseal root": ["sandfever", "dizziness", "epilepsy", "impatience", "shyness", "stupidity", "depression", "fulminated"],
    "bloodroot leaf": ["pyramides", "paralysis", "slickness"],
    "ginseng root": ["flushings", "addiction", "darkshade", "haemophilia", "lethargy", "nausea", "scytherus"]
  },
  focused: ["stuttering", "lovers", "agoraphobia", "anorexia", "claustrophobia", "confusion", "dizziness", "epilepsy", "generosity", "loneliness", "masochism", "pacifism", "recklessness", "shyness", "stupidity", "vertigo", "airdisrupt", "firedisrupt", "waterdisrupt", "paranoia", "dementia", "hallucinations"],
  smoked: ["deadening", "disloyalty", "slickness", "manaleech", "aeon", "hellsight", "tension"],
  applied: {
    body: ["torso", "itching", "anorexia", "frozen", "aflame", "selarnia"],
    skin: ["anorexia", "crippledarm", "crippledleg", "frozen", "selarnia"],
    torso: ["anorexia", "torso", "aflame", "hypothermia", "selarnia"],
    head: ["stuttering", "head", "crushedthroat", "calcifiedskull", "scalded"],
    arms: ["crippledarm", "rightarm", "leftarm"],
    legs: ["crippledleg", "rightleg", "leftleg"],
    ears: ["scalded", "head"]
  },
  treed: [
    "crushedthroat", "stuttering", "itching", "aeon", "healthleech", "haemophilia",
    "clumsiness", "aflame", "paranoia", "vertigo", "agoraphobia", "dizziness",
    "claustrophobia", "recklessness", "epilepsy", "addiction", "stupidity", "scytherus",
    "slickness", "generosity", "justice", "pacifism", "confusion", "voyria", "weariness",
    "hallucinations", "confusion", "disloyalty", "lethargy", "shyness", "sensitivity",
    "asthma", "crippledarm", "crippledleg", "darkshade", "impatience", "anorexia",
    "loneliness", "hypochondria", "selarnia", "leftleg", "leftarm", "rightleg", "rightarm",
    "frozen", "airdisrupt", "earthdisrupt", "firedisrupt", "spiritdisrupt", "waterdisrupt",
    "hellsight", "nausea", "lovers", "parasite", "depression", "timeloop", "manaleech",
    "tension", "tenderskin", "spiritburn", "pyramides", "sandfever", "fulminated"
  ]
};

const balances = {
  eat: 1.5,
  salve: {
    default: 1,
    limbs: 4
  },
  smoke: 1.5,
  focus: 2.5,
  tree: 14
};

const EnemyAfflictionTracker = () => {
  const [afflictions, setAfflictions] = useState([]);
  const [cureBalances, setCureBalances] = useState({
    eat: 0,
    salve: 0,
    smoke: 0,
    focus: 0,
    tree: 0
  });
  const [combatTime, setCombatTime] = useState(1);
  const [cureLog, setCureLog] = useState([]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        processCombatTime();
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [combatTime, afflictions, cureBalances]);

  const addAffliction = (aff) => {
    if (!afflictions.includes(aff)) {
      setAfflictions([...afflictions, aff]);
    }
  };

  const removeAffliction = (aff) => {
    setAfflictions(afflictions.filter(a => a !== aff));
  };

  const processCombatSecond = (currentSecond) => {
    let updatedAfflictions = [...afflictions];
    let updatedBalances = { ...cureBalances };
    let logEntries = [];

    // Decrement all balances
    Object.keys(updatedBalances).forEach(balance => {
      updatedBalances[balance] = Math.max(0, updatedBalances[balance] - 1);
    });

    // Attempt cures
    if (updatedBalances.eat === 0) {
      const herbsWithCurableAfflictions = Object.entries(cureTypes.eaten).filter(([herb, curedAffs]) => 
        updatedAfflictions.some(aff => curedAffs.includes(aff))
      );
      
      if (herbsWithCurableAfflictions.length > 0) {
        const [selectedHerb, curedAffs] = herbsWithCurableAfflictions[Math.floor(Math.random() * herbsWithCurableAfflictions.length)];
        const curableAfflictions = updatedAfflictions.filter(aff => curedAffs.includes(aff));
        if (curableAfflictions.length > 0) {
          const curedAff = curableAfflictions[Math.floor(Math.random() * curableAfflictions.length)];
          updatedAfflictions = updatedAfflictions.filter(aff => aff !== curedAff);
          updatedBalances.eat = balances.eat;
          logEntries.push(`${currentSecond}s: Ate ${selectedHerb} to cure ${curedAff}`);
        }
      }
    }

    if (updatedBalances.focus === 0 && updatedAfflictions.some(aff => cureTypes.focused.includes(aff))) {
      const curedAff = updatedAfflictions.find(aff => cureTypes.focused.includes(aff));
      updatedAfflictions = updatedAfflictions.filter(aff => aff !== curedAff);
      updatedBalances.focus = balances.focus;
      logEntries.push(`${currentSecond}s: Used focus to cure ${curedAff}`);
    }

    if (updatedBalances.smoke === 0 && updatedAfflictions.some(aff => cureTypes.smoked.includes(aff))) {
      const curedAff = updatedAfflictions.find(aff => cureTypes.smoked.includes(aff));
      updatedAfflictions = updatedAfflictions.filter(aff => aff !== curedAff);
      updatedBalances.smoke = balances.smoke;
      logEntries.push(`${currentSecond}s: Smoked pipe to cure ${curedAff}`);
    }

    if (updatedBalances.salve === 0) {
      const limbAffs = ['rightarm', 'rightleg', 'head', 'leftleg', 'leftarm', 'torso'];
      const curedAff = updatedAfflictions.find(aff => limbAffs.includes(aff));
      if (curedAff) {
        updatedAfflictions = updatedAfflictions.filter(aff => aff !== curedAff);
        updatedBalances.salve = balances.salve.limbs;
        logEntries.push(`${currentSecond}s: Applied salve to cure ${curedAff}`);
      } else {
        const otherAff = updatedAfflictions.find(aff => 
          Object.values(cureTypes.applied).flat().includes(aff)
        );
        if (otherAff) {
          updatedAfflictions = updatedAfflictions.filter(aff => aff !== otherAff);
          updatedBalances.salve = balances.salve.default;
          logEntries.push(`${currentSecond}s: Applied salve to cure ${otherAff}`);
        }
      }
    }

    if (updatedBalances.tree === 0 && updatedAfflictions.some(aff => cureTypes.treed.includes(aff))) {
      const curedAff = updatedAfflictions.find(aff => cureTypes.treed.includes(aff));
      updatedAfflictions = updatedAfflictions.filter(aff => aff !== curedAff);
      updatedBalances.tree = balances.tree;
      logEntries.push(`${currentSecond}s: Touched tree to cure ${curedAff}`);
    }

    return { afflictions: updatedAfflictions, balances: updatedBalances, logEntries };
  };

  const processCombatTime = () => {
    let currentAfflictions = [...afflictions];
    let currentBalances = {...cureBalances};
    let newLogEntries = [];

    for (let i = 0; i < combatTime; i++) {
      const result = processCombatSecond(i + 1);
      currentAfflictions = result.afflictions;
      currentBalances = result.balances;
      newLogEntries = [...newLogEntries, ...result.logEntries];
    }

    setAfflictions(currentAfflictions);
    setCureBalances(currentBalances);
    setCureLog(prevLog => [...newLogEntries, ...prevLog]);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Enemy Affliction Tracker</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <select 
          onChange={(e) => addAffliction(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
          value=""
        >
          <option value="">Add an affliction</option>
          {afflictionList.map(aff => (
            <option key={aff} value={aff}>{aff}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Current Afflictions</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {afflictions.map(aff => (
            <li key={aff} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              {aff}
              <button onClick={() => removeAffliction(aff)} style={{ padding: '2px 5px' }}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Cure Balances</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {Object.entries(cureBalances).map(([balance, time]) => (
            <li key={balance} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              {balance}: {time}s
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="combatTime" style={{ marginRight: '10px' }}>Combat Time (seconds):</label>
        <input 
          id="combatTime"
          type="number" 
          value={combatTime} 
          onChange={(e) => setCombatTime(Math.max(1, parseInt(e.target.value) || 1))}
          style={{ width: '60px' }}
        />
      </div>

      <button onClick={processCombatTime} style={{ width: '100%', padding: '10px', marginBottom: '20px' }}>Process Combat Time</button>

      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Cure Log</h2>
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
          {cureLog.map((entry, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EnemyAfflictionTracker;