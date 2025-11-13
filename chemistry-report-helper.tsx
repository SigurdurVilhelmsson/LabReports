import React, { useState, useEffect } from 'react';
import { FileText, BookOpen, Upload, CheckCircle, AlertCircle, History, RotateCcw, TrendingUp } from 'lucide-react';
import * as mammoth from 'mammoth';

const ChemistryReportApp = () => {
  const [view, setView] = useState('home');
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const experiments = [
    {
      id: 'jafnvaegi',
      title: 'Jafnvægi í efnahvörfum',
      year: 3,
      worksheet: {
        reaction: 'Fe³⁺(aq) + SCN⁻(aq) ↔ FeSCN²⁺(aq)',
        materials: ['KSCN(s)', '0,002M KSCN lausn', '0,2 M Fe(NO₃)₃', '0,1 M AgNO₃ lausn'],
        equipment: ['2 bikarglös', '6 tilraunaglös', 'glasastandur', 'dropateljarar'],
        steps: [
          'Búa til 100 mL af þremur lausnum með réttum mólstyrk',
          'Skoða KSCN lausn (litur og jónir)',
          'Blanda Fe(NO₃)₃ við KSCN - sjá litabreytingu',
          'Prófa 5 tilraunir með mismunandi breytingum:',
          '  1. Viðmið',
          '  2. Bæta við föstu KSCN',
          '  3. Bæta við Fe(NO₃)₃ lausn',
          '  4. Bæta við AgNO₃ lausn',
          '  5. Hita í 50°C vatni'
        ]
      }
    }
  ];

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const result = await window.storage.list('submission:');
      if (result && result.keys && Array.isArray(result.keys)) {
        const subs = [];
        for (const key of result.keys) {
          try {
            const data = await window.storage.get(key);
            if (data && data.value) {
              const parsed = JSON.parse(data.value);
              if (parsed) subs.push(parsed);
            }
          } catch (e) {
            console.log('Key not found:', key);
          }
        }
        setSubmissions(subs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } else {
        setSubmissions([]);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      setSubmissions([]);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setLoading(true);

    try {
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setExtractedText(result.value);
      } else if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        setExtractedText(`[IMAGE: ${file.name}]`);
        setUploadedFile({ ...file, base64, type: 'image' });
      } else {
        alert('Vinsamlegast hladdu upp Word skjali (.docx) eða mynd (JPEG, PNG)');
        setUploadedFile(null);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Villa við að lesa skrá. Reyndu aftur.');
      setUploadedFile(null);
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const parseCommentWithList = (text) => {
    if (!text) return <span>{text}</span>;
    
    const hasNumberedList = /\d+[).]\s/.test(text);
    
    if (!hasNumberedList) {
      return <p className="text-gray-700">{text}</p>;
    }
    
    const parts = text.split(/(?=\d+[).]\s)/);
    const beforeList = parts[0];
    const listItems = parts.slice(1);
    
    return (
      <div className="text-gray-700">
        {beforeList && <p className="mb-2">{beforeList}</p>}
        {listItems.length > 0 && (
          <ol className="list-decimal list-inside space-y-1">
            {listItems.map((item, i) => {
              const cleanedItem = item.replace(/^\d+[).]\s*/, '');
              return <li key={i}>{cleanedItem}</li>;
            })}
          </ol>
        )}
      </div>
    );
  };

  const getFeedback = async () => {
    setLoading(true);
    
    try {
      const exp = experiments.find(e => e.id === selectedExperiment);
      
      const messages = [];
      
      if (uploadedFile && uploadedFile.type === 'image') {
        messages.push({
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: uploadedFile.type,
                data: uploadedFile.base64
              }
            },
            {
              type: "text",
              text: `Þetta er mynd af skýrslu nemanda. Vinsamlegast lestu textann úr myndinni og gefðu endurgjöf.`
            }
          ]
        });
      } else {
        messages.push({
          role: "user",
          content: extractedText
        });
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: `Þú ert efnafræðikennari sem aðstoðar nemanda við að bæta skýrslu sína. Þú mátt ALDREI skrifa textann fyrir nemandann. Þú átt að gefa uppbyggilega, hvetjandi endurgjöf sem hjálpar nemandanum að læra.

🚨 ALLRA MIKILVÆGAST - LESTU ÞETTA VANDLEGA:

1. LESTU skýrsluna ORÐRÉTT. Ekki gera ráð fyrir villum. Ekki hallúcínera.
2. Ef nemandi hefur skrifað eitthvað - athugaðu NÁKVÆMLEGA hvað það er.
3. Ef nemandi HEFUR talið upp tæki og efni - segðu það og gefðu góða einkunn!
4. Ef jafna (1) ER til staðar - segðu það! Ekki segja að hún vanti!
5. ALDREI búa til athugasemdir um hluti sem ERU réttir í textanum.
6. **NOTAÐU RÉTTA STIGAFJÖLDA** - sjá matskvarða að neðan!

Ef þú ert ekki 100% viss um að eitthvað vanti - EKKI gera athugasemd við það.

🎯 HVERNIG Á AÐ GEFA EINKUNN:

Hver kafli hefur ÁKVEÐIÐ HÁMARK:
- Tilgangur: 0-3 stig (t.d. "2.5/3" eða "3/3", ALDREI "5/3")
- Fræði: 0-7.5 stig (t.d. "7/7.5", ALDREI "5/7.5" nema eitthvað vanti)
- Tæki: 0-1.5 stig (t.d. "1.5/1.5" ef allt er þar)
- Framkvæmd: 0-3 stig
- Niðurstöður: 0-7.5 stig
- Lokaorð: 0-6 stig
- Undirskrift: 0-1.5 stig (1.5/1.5 ef til staðar, 0/1.5 ef vantar)

Heildareinkunn = summa allra kafla (hámark 30)

MIKILVÆGT UM TÓN OG MÁLFRÆÐI: Vertu ALLTAF jákvæð og hvetjandi. Byrjaðu á því sem er vel gert. Þegar þú bendir á villur, gefðu nemandanum nákvæm dæmi sem hjálpa honum að HUGSA rétt án þess að skrifa textann fyrir hann.

ÍSLENSKA: Passaðu að öll svör séu á réttri íslensku:
• Notaðu rétta íslensku stafi (á, é, í, ó, ú, ý, þ, æ, ö, Á, É, Í, Ó, Ú, Ý, Þ, Æ, Ö)
• Athugaðu fallbeygingarnar (t.d. "í hitatilrauninni" ekki "í hitatiluninni")
• Athugaðu orðaröð og málfræði
• Forðastu málfræðivillur eins og "Margar staðreyndarvillur þurfa að laga" (ætti að vera "Það þarf að laga margar staðreyndarvillur" eða "Þú þarft að laga nokkur atriði")

Fyrir númeraða lista í athugasemdum, notaðu þetta snið:
1) Fyrsti liður
2) Annar liður
3) Þriðji liður

Tilraun: ${exp?.title || 'Óþekkt'}
Efnahvarf: ${exp?.worksheet?.reaction || ''}

EFNAFRÆÐILEG NÁKVÆMNI - MJÖG MIKILVÆGT:
• Fe(NO₃)₃ inniheldur Fe³⁺ jónir (ekki Fe²⁺) og NO₃⁻ jónir (ekki NO⁻)
• Fe(NO₃)₃ lausn er GUL eða LJÓSGUL (ekki blá!)
• KSCN inniheldur K⁺ og SCN⁻ jónir (EKKI ScN⁻ - það er alvarleg villa!)
• FeSCN²⁺ er dökkrauð/rústauð á lit
• AgNO₃ inniheldur Ag⁺ og NO₃⁻ jónir

KRÍTÍSKT: Gerir þú EINGÖNGU athugasemdir við villur sem eru RAUNVERULEGA í textanum. ALDREI gera ráð fyrir villum sem ekki eru til staðar. Ef nemandi segir "lausnin lýstist" - ekki gera athugasemd við það nema nemandi hafi skrifað rangt (t.d. "lausnin dökknaði" þegar hún átti að lýsast). Lestu textann MJÖG vandlega áður en þú gerir athugasemdir.

RÖKFRÆÐILEG ATHUGUN á Le Chatelier:
Nota SPURNINGAR til að leiða nemanda til að hugsa rétt.

JÖFNUR:
• Athugar þú hvort allar jöfnur og formúlur í fræðikafla séu NÚMERAÐAR (1), (2), (3)
• Vertu NÁKVÆM um hvaða jöfnu þú ert að tala um

TÉKKLISTI:
Fræðikafli: Skilgreining á efnajafnvægi, Le Chatelier með tengingu við áhrifaþætti, númeraðar jöfnur
Tæki og efni: Nemandi VERÐUR að telja upp öll tæki og efni - ekki nóg að vísa í vinnuseðil
Framkvæmd: Ef nemandi vísar í vinnuseðil er það GOTT
Niðurstöður: Útreikningar fyrir allar þrjár lausnir (KSCN, Fe(NO₃)₃, AgNO₃)
Lokaorð: Tengja við fræði

Svaraðu EINGÖNGU með JSON:
{
  "heildareinkunn": "X/30",
  "styrkir": ["jákvætt"],
  "almennarAthugasemdir": ["hvetjandi"],
  "kaflar": {
    "tilgangur": {"einkunn": X, "athugasemdir": "..."},
    "fræði": {"einkunn": X, "athugasemdir": "..."},
    "tæki": {"einkunn": X, "athugasemdir": "nemandi VERÐUR að telja upp öll tæki og efni"},
    "framkvæmd": {"einkunn": X, "athugasemdir": "..."},
    "niðurstöður": {"einkunn": X, "athugasemdir": "Ef margar athugasemdir, settu þær á númeraðan lista með 1) 2) 3)"},
    "lokaorð": {"einkunn": X, "athugasemdir": "..."}
  },
  "næstuSkref": ["nákvæm skref"]
}`,
          messages: messages,
        })
      });

      const data = await response.json();
      const feedbackText = data.content?.find(item => item.type === 'text')?.text || '';
      
      const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedFeedback = JSON.parse(jsonMatch[0]);
        setFeedback(parsedFeedback);
        
        const sessionId = currentSessionId || `session_${Date.now()}`;
        if (!currentSessionId) setCurrentSessionId(sessionId);
        
        const submission = {
          id: `submission_${Date.now()}`,
          sessionId: sessionId,
          experiment: selectedExperiment,
          filename: uploadedFile?.name || 'unknown',
          timestamp: new Date().toISOString(),
          feedback: parsedFeedback,
          extractedText: extractedText.substring(0, 500)
        };
        
        await window.storage.set(`submission:${submission.id}`, JSON.stringify(submission));
        await loadSubmissions();
      } else {
        throw new Error('Could not parse feedback');
      }
      
    } catch (error) {
      console.error('Error getting feedback:', error);
      alert('Villa við að sækja endurgjöf. Reyndu aftur.');
    } finally {
      setLoading(false);
    }
  };

  const startNewSession = (expId) => {
    setSelectedExperiment(expId);
    setUploadedFile(null);
    setExtractedText('');
    setFeedback(null);
    setCurrentSessionId(null);
    setView('worksheet');
  };

  const getSessionSubmissions = (sessionId) => {
    if (!Array.isArray(submissions)) return [];
    return submissions.filter(s => s?.sessionId === sessionId);
  };

  const getStatistics = () => {
    if (!Array.isArray(submissions) || submissions.length === 0) {
      return {
        totalSessions: 0,
        totalSubmissions: 0,
        avgSubmissionsPerSession: '0.0',
        avgGrade: '0.0'
      };
    }
    
    const sessions = [...new Set(submissions.map(s => s?.sessionId).filter(Boolean))];
    const avgSubmissionsPerSession = sessions.length > 0 ? submissions.length / sessions.length : 0;
    
    const grades = submissions
      .map(s => {
        const match = s?.feedback?.heildareinkunn?.match(/(\d+)/);
        return match ? parseInt(match[0]) : 0;
      })
      .filter(g => g > 0);
    
    const avgGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
    
    return {
      totalSessions: sessions.length,
      totalSubmissions: submissions.length,
      avgSubmissionsPerSession: avgSubmissionsPerSession.toFixed(1),
      avgGrade: avgGrade.toFixed(1)
    };
  };

  // HOME VIEW
  if (view === 'home') {
    const stats = getStatistics();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">Efnafræðiskýrslur</h1>
            <p className="text-gray-600 mb-6">Aðstoð við að skrifa skýrslur úr verklegum æfingum</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong>Athugið:</strong> Þetta app aðstoðar þig við að skrifa betri skýrslu, en skrifar hana ALDREI fyrir þig.
              </p>
            </div>

            {stats.totalSubmissions > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-900">{stats.totalSessions}</div>
                  <div className="text-sm text-indigo-700">Skýrslur</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">{stats.totalSubmissions}</div>
                  <div className="text-sm text-green-700">Innsendingar</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">{stats.avgSubmissionsPerSession}</div>
                  <div className="text-sm text-purple-700">Meðaltal/skýrsla</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-900">{stats.avgGrade}/30</div>
                  <div className="text-sm text-orange-700">Meðaleinkunn</div>
                </div>
              </div>
            )}

            <div className="grid gap-4 mb-6">
              <button
                onClick={() => setView('experiments')}
                className="bg-indigo-600 text-white px-6 py-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-lg font-semibold"
              >
                <FileText size={24} />
                Byrja nýja skýrslu
              </button>
              
              {Array.isArray(submissions) && submissions.length > 0 && (
                <button
                  onClick={() => setView('history')}
                  className="bg-gray-600 text-white px-6 py-4 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 text-lg font-semibold"
                >
                  <History size={24} />
                  Skoða sögu ({submissions.length} innsendingar)
                </button>
              )}
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Hvernig virkar þetta?</h2>
              <ol className="space-y-2 text-gray-700">
                <li className="flex gap-2"><span className="font-bold">1.</span> Veldu tilraun</li>
                <li className="flex gap-2"><span className="font-bold">2.</span> Skoðaðu vinnuseðil</li>
                <li className="flex gap-2"><span className="font-bold">3.</span> Skrifaðu skýrsluna í Word</li>
                <li className="flex gap-2"><span className="font-bold">4.</span> Hladdu upp Word skjalinu (.docx) eða skjámynd</li>
                <li className="flex gap-2"><span className="font-bold">5.</span> Fáðu endurgjöf og bættu skýrsluna</li>
                <li className="flex gap-2"><span className="font-bold">6.</span> Endurtaktu þar til þú ert ánægð/ur</li>
                <li className="flex gap-2"><span className="font-bold">7.</span> Skildu fullbúinni skýrslu í Innu</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EXPERIMENTS LIST
  if (view === 'experiments') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setView('home')}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            ← Til baka
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">Veldu tilraun</h2>
            
            <div className="space-y-4">
              {experiments.map(exp => (
                <div key={exp.id} className="border rounded-lg p-4 hover:border-indigo-500 transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{exp.title}</h3>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                      {exp.year}. ár
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Efnahvarf: {exp.worksheet.reaction}</p>
                  <button
                    onClick={() => startNewSession(exp.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  >
                    Velja þessa tilraun
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // WORKSHEET VIEW
  if (view === 'worksheet') {
    const exp = experiments.find(e => e.id === selectedExperiment);
    if (!exp) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setView('home')}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            ← Til baka
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-8 mb-4">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-indigo-600" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-indigo-900">{exp.title}</h2>
                <p className="text-gray-600">Vinnuseðill</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Efnahvarf:</h3>
                <p className="bg-gray-50 p-3 rounded font-mono">{exp.worksheet.reaction}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">Efni:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {exp.worksheet.materials.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">Áhöld:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {exp.worksheet.equipment.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-2">Framkvæmd:</h3>
                <ul className="space-y-1 text-gray-700">
                  {exp.worksheet.steps.map((step, i) => (
                    <li key={i} className={step.startsWith('  ') ? 'ml-8' : ''}>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => setView('upload')}
            className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-lg font-semibold"
          >
            Halda áfram → Senda inn drög
          </button>
        </div>
      </div>
    );
  }

  // UPLOAD VIEW
  if (view === 'upload') {
    const exp = experiments.find(e => e.id === selectedExperiment);
    const sessionSubs = currentSessionId ? getSessionSubmissions(currentSessionId) : [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setView('worksheet')}
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
            >
              ← Skoða vinnuseðil
            </button>
            <button
              onClick={() => setView('home')}
              className="text-gray-600 hover:text-gray-800"
            >
              Hætta við
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">{exp?.title}</h2>
            <p className="text-gray-600 mb-6">Hladdu upp drögunum þínum</p>

            {Array.isArray(sessionSubs) && sessionSubs.length > 0 && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <p className="text-sm text-green-900 flex items-center gap-2">
                  <CheckCircle size={18} />
                  Þú hefur sent inn drög {sessionSubs.length} {sessionSubs.length === 1 ? 'sinni' : 'sinnum'} fyrir þessa skýrslu
                </p>
              </div>
            )}

            <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center mb-6">
              <Upload className="mx-auto mb-4 text-indigo-600" size={48} />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Veldu skrá</h3>
              <p className="text-sm text-gray-600 mb-4">
                Word skjal (.docx) eða mynd (JPEG, PNG)
              </p>
              <input
                type="file"
                accept=".docx,image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition cursor-pointer inline-block"
              >
                Velja skrá
              </label>
            </div>

            {uploadedFile && !loading && (
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="text-gray-600" size={24} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {extractedText && extractedText.length > 100 
                        ? `${extractedText.substring(0, 100)}...` 
                        : extractedText || 'Tilbúið til að greina'}
                    </p>
                  </div>
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center gap-3 py-8">
                <RotateCcw className="animate-spin text-indigo-600" size={32} />
                <p className="text-gray-700">Les skrána...</p>
              </div>
            )}

            {uploadedFile && !loading && (
              <button
                onClick={getFeedback}
                disabled={loading}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
              >
                <CheckCircle size={24} />
                Fá endurgjöf á drögin
              </button>
            )}

            {feedback && (
              <div className="mt-8 border-t pt-8">
                <h3 className="text-2xl font-bold text-indigo-900 mb-4">Endurgjöf</h3>
                
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
                  <p className="text-2xl font-bold text-indigo-900">
                    Áætluð einkunn: {feedback.heildareinkunn || 'N/A'}
                  </p>
                  <p className="text-sm text-indigo-700 mt-1">
                    Þetta er til leiðbeiningar - raunveruleg einkunn kemur frá kennara
                  </p>
                </div>

                {Array.isArray(feedback.styrkir) && feedback.styrkir.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle size={20} />
                      Styrkir
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {feedback.styrkir.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}

                {Array.isArray(feedback.almennarAthugasemdir) && feedback.almennarAthugasemdir.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                      <AlertCircle size={20} />
                      Almennar athugasemdir
                    </h4>
                    <div className="space-y-2">
                      {feedback.almennarAthugasemdir.map((a, i) => (
                        <div key={i}>{parseCommentWithList(a)}</div>
                      ))}
                    </div>
                  </div>
                )}

                {feedback.kaflar && typeof feedback.kaflar === 'object' && (
                  <div className="space-y-4 mb-6">
                    <h4 className="font-bold text-gray-800">Endurgjöf eftir köflum:</h4>
                    {Object.keys(feedback.kaflar).map(key => {
                      const chapterNames = {
                        'tilgangur': 'Tilgangur (10% - hámark 3 stig)',
                        'fræði': 'Fræðilegur bakgrunnur (25% - hámark 7.5 stig)',
                        'tæki': 'Tæki og efni (5% - hámark 1.5 stig)',
                        'framkvæmd': 'Framkvæmd (10% - hámark 3 stig)',
                        'niðurstöður': 'Niðurstöður (25% - hámark 7.5 stig)',
                        'lokaorð': 'Lokaorð (20% - hámark 6 stig)',
                        'undirskrift': 'Undirskrift (5% - hámark 1.5 stig)'
                      };
                      const chapter = feedback.kaflar[key];
                      return (
                        <div key={key} className="border-l-4 border-orange-300 pl-4">
                          <h5 className="font-semibold text-gray-800">{chapterNames[key] || key}</h5>
                          <p className="text-sm text-orange-800 font-semibold">
                            Einkunn: {chapter?.einkunn ?? 'N/A'}
                          </p>
                          {parseCommentWithList(chapter?.athugasemdir || 'Engar athugasemdir')}
                        </div>
                      );
                    })}
                  </div>
                )}

                {Array.isArray(feedback.næstuSkref) && feedback.næstuSkref.length > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                    <h4 className="font-bold text-yellow-900 mb-2">Næstu skref:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-yellow-900">
                      {feedback.næstuSkref.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setExtractedText('');
                      setFeedback(null);
                    }}
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Senda inn aftur
                  </button>
                  <button
                    onClick={() => setView('home')}
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                  >
                    Loka
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // HISTORY VIEW
  if (view === 'history') {
    const sessionGroups = {};
    if (Array.isArray(submissions)) {
      submissions.forEach(sub => {
        if (sub && sub.sessionId) {
          if (!sessionGroups[sub.sessionId]) {
            sessionGroups[sub.sessionId] = [];
          }
          sessionGroups[sub.sessionId].push(sub);
        }
      });
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setView('home')}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            ← Til baka
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
              <History size={28} />
              Saga innsendinga
            </h2>
            
            <div className="space-y-6">
              {Object.keys(sessionGroups).length === 0 ? (
                <p className="text-gray-600">Engar innsendingar ennþá.</p>
              ) : (
                Object.keys(sessionGroups).map(sessionId => {
                  const subs = sessionGroups[sessionId];
                  if (!Array.isArray(subs) || subs.length === 0) return null;
                  
                  const firstSub = subs[0];
                  const lastSub = subs[subs.length - 1];
                  const exp = experiments.find(e => e.id === firstSub?.experiment);
                  
                  const grades = subs
                    .map(s => {
                      const match = s?.feedback?.heildareinkunn?.match(/(\d+)/);
                      return match ? parseInt(match[0]) : 0;
                    })
                    .filter(g => g > 0);
                  
                  const improvement = grades.length > 1 ? grades[grades.length - 1] - grades[0] : 0;
                  
                  return (
                    <div key={sessionId} className="border rounded-lg p-6 hover:border-indigo-500 transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{exp?.title || 'Óþekkt tilraun'}</h3>
                          <p className="text-sm text-gray-600">
                            Byrjað: {firstSub?.timestamp ? new Date(firstSub.timestamp).toLocaleDateString('is-IS') : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Síðast: {lastSub?.timestamp ? new Date(lastSub.timestamp).toLocaleDateString('is-IS') : 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className={improvement > 0 ? 'text-green-600' : 'text-gray-400'} size={20} />
                            <span className={`text-2xl font-bold ${improvement > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                              {improvement > 0 ? '+' : ''}{improvement}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{subs.length} innsendingar</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {subs.map((sub, idx) => (
                          <div key={sub?.id || idx} className="bg-gray-50 rounded p-3 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                Innsending #{idx + 1}: {sub?.filename || 'Óþekkt skrá'}
                              </p>
                              <p className="text-xs text-gray-600">
                                {sub?.timestamp ? new Date(sub.timestamp).toLocaleString('is-IS') : 'N/A'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-indigo-900">
                                {sub?.feedback?.heildareinkunn || 'N/A'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ChemistryReportApp;