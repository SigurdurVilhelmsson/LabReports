import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, XCircle, AlertTriangle, Download, RotateCcw, History, Save, Trash2 } from 'lucide-react';
import * as mammoth from 'mammoth';

// Experiment configurations - Easy to maintain and extend
const experimentConfigs = {
  jafnvaegi: {
    id: 'jafnvaegi',
    title: 'Jafnvægi í efnahvörfum',
    year: 3,
    sections: [
      { 
        id: 'tilgangur', 
        name: 'Tilgangur',
        description: '1-2 sentences about goals',
        criteria: {
          good: 'Skýr lýsing á markmiðum tilraunarinnar',
          needsImprovement: 'Tilgangur til staðar en vantar smáatriði',
          unsatisfactory: 'Mjög óljós eða vantar alveg'
        }
      },
      { 
        id: 'fraedi', 
        name: 'Fræðikafli',
        description: 'Definitions, Le Chatelier\'s law, numbered equations',
        criteria: {
          good: 'Skilgreiningar, Le Chatelier lögmál og númeraðar jöfnur',
          needsImprovement: 'Fræðin til staðar en eitthvað vantar',
          unsatisfactory: 'Vantar mikilvæga fræðilega þætti'
        }
      },
      { 
        id: 'taeki', 
        name: 'Tæki og efni',
        description: 'Complete list of equipment and materials',
        criteria: {
          good: 'Fullkominn listi yfir tæki og efni',
          needsImprovement: 'Listi til staðar en eitthvað vantar',
          unsatisfactory: 'Mjög ófullkominn eða vantar'
        }
      },
      { 
        id: 'framkvamd', 
        name: 'Framkvæmd',
        description: 'Should reference worksheet ("Sjá vinnuseðil") + brief 1-2 sentence description',
        criteria: {
          good: 'Vísar í vinnuseðil og stuttur lýsing á framkvæmd - þetta er rétt!',
          needsImprovement: 'Annaðhvort vinnuseðilsvísun eða lýsing vantar',
          unsatisfactory: 'Vantar eða of ítarleg (nemendur eiga EKKI að skrifa ítarlegar leiðbeiningar)'
        },
        specialNote: 'Students should NOT write detailed procedures - referencing worksheet is GOOD!'
      },
      { 
        id: 'nidurstodur', 
        name: 'Niðurstöður',
        description: 'All calculations (KSCN, Fe(NO₃)₃, AgNO₃), observations, explanations',
        criteria: {
          good: 'Allar útreikningar, athuganir og skýringar til staðar',
          needsImprovement: 'Flest til staðar en vantar smáatriði',
          unsatisfactory: 'Vantar mikilvæga útreikninga eða skýringar'
        }
      },
      { 
        id: 'lokaord', 
        name: 'Lokaorð',
        description: 'Summary, connection to theory',
        criteria: {
          good: 'Gott samantekt og tengsl við fræðin',
          needsImprovement: 'Samantekt til staðar en gæti verið betri',
          unsatisfactory: 'Mjög veik samantekt eða vantar'
        }
      },
      { 
        id: 'undirskrift', 
        name: 'Undirskrift',
        description: 'Student signature present',
        criteria: {
          good: 'Undirskrift til staðar',
          unsatisfactory: 'Vantar undirskrift'
        }
      }
    ],
    gradeScale: ['10', '8', '5', '0']
  }
};

const buildSystemPrompt = (experiment) => {
  return `You are evaluating chemistry lab reports for teachers. Categorize each section quickly and objectively.

Experiment: ${experiment.title}

For EACH section, determine:
1. Is it present? (yes/no)
2. If yes, quality: "good" / "needs improvement" / "unsatisfactory"

Sections to check:
${experiment.sections.map(s => `- ${s.name}: ${s.description}${s.specialNote ? ' ' + s.specialNote : ''}`).join('\n')}

Quality criteria:
- "good": Section complete, correct, well-explained
- "needs improvement": Section present but missing details or has minor errors
- "unsatisfactory": Section severely incomplete or major errors

IMPORTANT: All notes/comments must be in Icelandic!

Respond ONLY with JSON:
{
  "sections": {
${experiment.sections.map(s => `    "${s.id}": {"present": true/false, "quality": "good"/"needs improvement"/"unsatisfactory", "note": "stuttur texti á íslensku"}`).join(',\n')}
  },
  "suggestedGrade": "10/8/5/0"
}`;
};

const TeacherReportGrader = () => {
  const [view, setView] = useState('grader');
  const [selectedExperiment, setSelectedExperiment] = useState('jafnvaegi');
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [savedSessions, setSavedSessions] = useState([]);
  const [currentSessionName, setCurrentSessionName] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [processingStatus, setProcessingStatus] = useState({ current: 0, total: 0, currentFile: '' });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveDialogName, setSaveDialogName] = useState('');
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const experiments = Object.values(experimentConfigs);
  const currentExperiment = experimentConfigs[selectedExperiment];
  const sections = currentExperiment.sections;

  useEffect(() => {
    loadSavedSessions();
  }, []);

  const loadSavedSessions = async () => {
    try {
      const result = await window.storage.list('grading_session:');
      if (result && result.keys && Array.isArray(result.keys)) {
        const sessions = [];
        for (const key of result.keys) {
          try {
            const data = await window.storage.get(key);
            if (data && data.value) {
              sessions.push(JSON.parse(data.value));
            }
          } catch (e) {
            console.log('Key not found:', key);
          }
        }
        setSavedSessions(sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const saveCurrentSession = async () => {
    if (results.length === 0) {
      showToast('Engar niðurstöður til að vista', 'error');
      return;
    }

    if (!currentSessionName) {
      setSaveDialogName(`Greining ${new Date().toLocaleDateString('is-IS')}`);
      setShowSaveDialog(true);
      return;
    }

    await performSave(currentSessionName);
  };

  const performSave = async (name) => {
    try {
      const sessionId = currentSessionId || `session_${Date.now()}`;
      const session = {
        id: sessionId,
        name: name,
        experiment: selectedExperiment,
        timestamp: new Date().toISOString(),
        results: results,
        fileCount: results.length
      };

      try {
        await window.storage.set(`grading_session:${session.id}`, JSON.stringify(session));
        setCurrentSessionName(name);
        setCurrentSessionId(sessionId);
        setIsSaved(true);
        await loadSavedSessions();
        showToast('✓ Greining vistuð!', 'success');
      } catch (storageError) {
        console.error('Storage error:', storageError);
        setCurrentSessionName(name);
        setCurrentSessionId(sessionId);
        setIsSaved(true);
        showToast('Athugið: Geymsla virkar ekki í augnablikinu. Niðurstöður eru aðeins vistaðar tímabundið.', 'warning');
      }
      
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Error saving session:', error);
      showToast(`Villa við að vista: ${error.message}`, 'error');
    }
  };

  const startNewAnalysis = () => {
    if (results.length > 0 && !isSaved) {
      setShowConfirmNew(true);
    } else {
      clearAnalysis();
    }
  };

  const clearAnalysis = () => {
    setFiles([]);
    setResults([]);
    setCurrentSessionName('');
    setCurrentSessionId('');
    setIsSaved(false);
    setProcessingStatus({ current: 0, total: 0, currentFile: '' });
    setShowConfirmNew(false);
  };

  const loadSession = async (sessionId) => {
    try {
      const data = await window.storage.get(`grading_session:${sessionId}`);
      if (data && data.value) {
        const session = JSON.parse(data.value);
        setResults(session.results);
        setSelectedExperiment(session.experiment);
        setCurrentSessionName(session.name);
        setCurrentSessionId(session.id);
        setIsSaved(true);
        setView('grader');
        showToast('Greining hlaðin', 'success');
      }
    } catch (error) {
      console.error('Error loading session:', error);
      showToast('Villa við að hlaða greiningu', 'error');
    }
  };

  const deleteSession = async (sessionId) => {
    setSessionToDelete(sessionId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      await window.storage.delete(`grading_session:${sessionToDelete}`);
      await loadSavedSessions();
      setShowDeleteDialog(false);
      setSessionToDelete(null);
      showToast('Greiningu eytt', 'success');
    } catch (error) {
      console.error('Error deleting session:', error);
      showToast('Villa við að eyða', 'error');
    }
  };

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
    setResults([]);
    setIsSaved(false);
  };

  const extractTextFromFile = async (file) => {
    try {
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } else if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        return { type: 'image', data: base64, mediaType: file.type };
      }
      return null;
    } catch (error) {
      console.error('Error extracting text:', error);
      return null;
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

  const processReports = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setProcessingStatus({ current: 0, total: files.length, currentFile: '' });
    const newResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      setProcessingStatus({ 
        current: i + 1, 
        total: files.length, 
        currentFile: file.name 
      });

      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout - skýrsla tók of langan tíma')), 30000)
        );

        const processPromise = (async () => {
          const content = await extractTextFromFile(file);
          if (!content) {
            return {
              filename: file.name,
              error: 'Gat ekki lesið skrá'
            };
          }

          const messages = [];
          
          if (content.type === 'image') {
            messages.push({
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: content.mediaType,
                    data: content.data
                  }
                },
                {
                  type: "text",
                  text: "Read this lab report and categorize it."
                }
              ]
            });
          } else {
            messages.push({
              role: "user",
              content: content
            });
          }

          const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 2000,
              system: buildSystemPrompt(currentExperiment),
              messages: messages,
            })
          });

          const data = await response.json();
          const resultText = data.content?.find(item => item.type === 'text')?.text || '';
          
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              filename: file.name,
              ...parsed
            };
          } else {
            return {
              filename: file.name,
              error: 'Gat ekki túlkað svar'
            };
          }
        })();

        const result = await Promise.race([processPromise, timeoutPromise]);
        newResults.push(result);

      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        newResults.push({
          filename: file.name,
          error: error.message || 'Villa við vinnslu'
        });
      }
    }

    setResults(newResults);
    setProcessing(false);
    setIsSaved(false);
    setProcessingStatus({ current: 0, total: 0, currentFile: '' });
  };

  const getQualityIcon = (quality) => {
    if (quality === 'good') return <CheckCircle className="text-green-600" size={20} />;
    if (quality === 'needs improvement') return <AlertTriangle className="text-yellow-600" size={20} />;
    return <XCircle className="text-red-600" size={20} />;
  };

  const getQualityColor = (quality) => {
    if (quality === 'good') return 'bg-green-50 border-green-300';
    if (quality === 'needs improvement') return 'bg-yellow-50 border-yellow-300';
    return 'bg-red-50 border-red-300';
  };

  const exportResults = () => {
    try {
      const csv = [
        ['Filename', 'Suggested Grade', ...sections.map(s => s.name + ' Present'), ...sections.map(s => s.name + ' Quality')],
        ...results.map(r => [
          r.filename,
          r.suggestedGrade || 'N/A',
          ...sections.map(s => r.sections?.[s.id]?.present ? 'Yes' : 'No'),
          ...sections.map(s => r.sections?.[s.id]?.quality || 'N/A')
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lab_report_grades_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('CSV skrá niðurhalað', 'success');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showToast('Villa við að búa til CSV skrá. Reyndu aftur.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Kennslutól - Skýrslumat v3
                <span className="text-sm text-orange-600 ml-3 font-normal">(Development)</span>
              </h1>
              <p className="text-slate-600">Hraðmat á skýrslum nemenda</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  startNewAnalysis();
                  setView('grader');
                }}
                className={`px-4 py-2 rounded-lg transition ${
                  view === 'grader'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Ný greining
              </button>
              <button
                onClick={() => setView('history')}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  view === 'history'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                <History size={18} />
                Saga ({savedSessions.length})
              </button>
            </div>
          </div>

          {view === 'history' ? (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Eldri greiningar</h2>
              {savedSessions.length === 0 ? (
                <p className="text-slate-600 text-center py-8">Engar vistaðar greiningar</p>
              ) : (
                <div className="space-y-3">
                  {savedSessions.map(session => (
                    <div key={session.id} className="border rounded-lg p-4 flex justify-between items-center hover:border-indigo-500 transition">
                      <div>
                        <h3 className="font-semibold text-slate-800">{session.name}</h3>
                        <p className="text-sm text-slate-600">
                          {experimentConfigs[session.experiment]?.title || session.experiment} - {session.fileCount} skýrslur
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(session.timestamp).toLocaleString('is-IS')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadSession(session.id)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                        >
                          Opna
                        </button>
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Veldu tilraun:
                </label>
                <select
                  value={selectedExperiment}
                  onChange={(e) => setSelectedExperiment(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {experiments.map(exp => (
                    <option key={exp.id} value={exp.id}>
                      {exp.title} ({exp.year}. ár)
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mb-6">
                <Upload className="mx-auto mb-4 text-slate-600" size={48} />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Hladdu upp skýrslum</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Word skjöl (.docx) eða myndir - margar í einu
                </p>
                <input
                  type="file"
                  accept=".docx,image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition cursor-pointer inline-block"
                >
                  Velja skrár
                </label>
              </div>

              {files.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 mb-3">
                    {files.length} skrá{files.length !== 1 ? 'r' : ''} valin{files.length !== 1 ? 'ar' : ''}
                  </h3>
                  <div className="space-y-2 mb-4">
                    {files.map((file, i) => (
                      <div key={i} className="bg-slate-50 p-3 rounded flex items-center gap-3">
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="text-sm text-slate-700">{file.name}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={processReports}
                    disabled={processing}
                    className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
                  >
                    {processing ? (
                      <>
                        <RotateCcw className="animate-spin" size={24} />
                        <div className="text-left">
                          <div>Vinn úr skýrslum... ({processingStatus.current}/{processingStatus.total})</div>
                          <div className="text-sm font-normal">
                            {processingStatus.currentFile}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={24} />
                        Greina skýrslur
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {view === 'grader' && results.length > 0 && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Niðurstöður
                {currentSessionName && <span className="text-lg text-slate-600 ml-3">- {currentSessionName}</span>}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={saveCurrentSession}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Save size={20} />
                  Vista greiningu
                </button>
                <button
                  onClick={exportResults}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <Download size={20} />
                  Niðurhala CSV
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {results.map((result, idx) => (
                <div key={idx} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">{result.filename}</h3>
                    {result.suggestedGrade && (
                      <div className="text-right">
                        <div className="text-sm text-slate-600">Tillaga að einkunn:</div>
                        <div className="text-2xl font-bold text-indigo-900">{result.suggestedGrade}</div>
                      </div>
                    )}
                  </div>

                  {result.error ? (
                    <div className="bg-red-50 border border-red-300 rounded p-4 text-red-800">
                      Villa: {result.error}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {sections.map(section => {
                        const data = result.sections?.[section.id];
                        if (!data) return null;

                        return (
                          <div
                            key={section.id}
                            className={`border rounded-lg p-4 ${
                              data.present ? getQualityColor(data.quality) : 'bg-slate-50 border-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-2">
                              {data.present ? (
                                getQualityIcon(data.quality)
                              ) : (
                                <XCircle className="text-slate-400" size={20} />
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-800">{section.name}</h4>
                                <div className="text-sm">
                                  {data.present ? (
                                    <>
                                      <span className="font-medium">
                                        {data.quality === 'good' && 'Gott'}
                                        {data.quality === 'needs improvement' && 'Þarf að bæta'}
                                        {data.quality === 'unsatisfactory' && 'Ófullnægjandi'}
                                      </span>
                                      {data.note && <div className="text-slate-600 mt-1">{data.note}</div>}
                                    </>
                                  ) : (
                                    <span className="text-slate-600">Vantar</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Vista greiningu</h3>
            <input
              type="text"
              value={saveDialogName}
              onChange={(e) => setSaveDialogName(e.target.value)}
              placeholder="Sláðu inn heiti..."
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && saveDialogName.trim()) {
                  performSave(saveDialogName);
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                Hætta við
              </button>
              <button
                onClick={() => {
                  if (saveDialogName.trim()) {
                    performSave(saveDialogName);
                  }
                }}
                disabled={!saveDialogName.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                Vista
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmNew && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Byrja nýja greiningu?</h3>
            <p className="text-slate-700 mb-6">
              Þú ert með óvistaðar niðurstöður. Viltu vista áður en þú byrjar nýja greiningu?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirmNew(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                Hætta við
              </button>
              <button
                onClick={clearAnalysis}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Eyða án þess að vista
              </button>
              <button
                onClick={() => {
                  setShowConfirmNew(false);
                  saveCurrentSession();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Vista fyrst
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Eyða greiningu?</h3>
            <p className="text-slate-700 mb-6">
              Ertu viss um að þú viljir eyða þessari greiningu? Þetta er ekki hægt að afturkalla.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSessionToDelete(null);
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                Hætta við
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Eyða
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] ${
            toast.type === 'success' ? 'bg-green-600 text-white' :
            toast.type === 'error' ? 'bg-red-600 text-white' :
            toast.type === 'warning' ? 'bg-yellow-600 text-white' :
            'bg-indigo-600 text-white'
          }`}>
            {toast.type === 'success' && <CheckCircle size={24} />}
            {toast.type === 'error' && <XCircle size={24} />}
            {toast.type === 'warning' && <AlertTriangle size={24} />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherReportGrader;