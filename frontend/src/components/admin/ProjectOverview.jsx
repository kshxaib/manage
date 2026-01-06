import { useState, useEffect } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useDeveloperStore } from '../../stores/useDeveloperStore';
import { toast } from 'sonner';

const ProjectOverview = ({ projectId, projects, onBack }) => {
    const { user } = useAuthStore();
    const { developers } = useDeveloperStore();
    const {
        toggleProjectLock,
        addDeveloperToProject,
        removeDeveloperFromProject,
        addDocument,
        updateProjectInfo,
        updateInfrastructure,
        updateProjectProgress,
        isLoading
    } = useProjectStore();

    const [activeTab, setActiveTab] = useState('overview');

    // Modal states
    const [isDevModalOpen, setIsDevModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isInfraModalOpen, setIsInfraModalOpen] = useState(false);

    // Form states
    const [devForm, setDevForm] = useState({ developerId: '', role: 'FULLSTACK' });
    const [docForm, setDocForm] = useState({ type: 'DRIVE', title: '', link: '' });
    const [editForm, setEditForm] = useState({});
    const [paymentForm, setPaymentForm] = useState({ amountPaid: '' });
    const [infraForm, setInfraForm] = useState({
        deploymentLinks: '',
        hosting: { backendHosting: '', database: '', domainName: '' }
    });

    const project = projects?.find(p => p._id === projectId);

    useEffect(() => {
        if (project) {
            setEditForm({
                projectName: project.projectName || '',
                projectType: project.projectType || 'WEBSITE',
                status: project.status || 'PLANNING',
                techStack: project.techStack || '',
                startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
                expectedEndDate: project.expectedEndDate ? new Date(project.expectedEndDate).toISOString().split('T')[0] : '',
                projectDescription: project.projectDescription || ''
            });

            setInfraForm({
                deploymentLinks: project.deploymentLinks?.join(', ') || '',
                hosting: {
                    backendHosting: project.hosting?.backendHosting || '',
                    database: project.hosting?.database || '',
                    domainName: project.hosting?.domainName || ''
                }
            });
        }
    }, [project]);

    if (!project) return (
        <div className="flex flex-col items-center justify-center p-20 bg-bg-card border border-border rounded-xl">
            <h3 className="text-xl font-bold text-text-primary">Project Not Found</h3>
            <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg transition-all hover:bg-primary-hover shadow-lg shadow-primary/20 font-bold uppercase text-xs tracking-widest">Go Back</button>
        </div>
    );

    const isAdmin = user?.role === 'ADMIN';
    const isLocked = project?.isLocked;

    const handleLockToggle = async () => {
        if (!isAdmin) return;
        await toggleProjectLock(project._id);
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        const success = await updateProjectInfo(project._id, editForm);
        if (success) setIsEditModalOpen(false);
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        const amount = parseFloat(paymentForm.amountPaid);
        if (isNaN(amount) || amount <= 0) return toast.error("Enter a valid amount");
        const success = await updateProjectProgress(project._id, { amountPaid: amount });
        if (success) {
            setIsPaymentModalOpen(false);
            setPaymentForm({ amountPaid: '' });
        }
    };

    const handleUpdateInfra = async (e) => {
        e.preventDefault();
        const deploymentLinks = infraForm.deploymentLinks.split(',').map(l => l.trim()).filter(l => l !== '');
        const success = await updateInfrastructure(project._id, {
            deploymentLinks,
            hosting: infraForm.hosting
        });
        if (success) setIsInfraModalOpen(false);
    };

    const handleAddDeveloper = async (e) => {
        e.preventDefault();
        if (!devForm.developerId) return toast.error("Select a developer");
        const success = await addDeveloperToProject(project._id, devForm);
        if (success) {
            setIsDevModalOpen(false);
            setDevForm({ developerId: '', role: 'FULLSTACK' });
        }
    };

    const handleRemoveDeveloper = async (devId) => {
        if (!window.confirm("Are you sure you want to remove this developer?")) return;
        await removeDeveloperFromProject(project._id, devId);
    };

    const handleAddDocument = async (e) => {
        e.preventDefault();
        if (!docForm.title || !docForm.link) return toast.error("Fill all link details");
        const success = await addDocument(project._id, docForm);
        if (success) {
            setIsDocModalOpen(false);
            setDocForm({ type: 'DRIVE', title: '', link: '' });
        }
    };

    const paymentProgress = project.paymentSnapshot
        ? (project.paymentSnapshot.amountPaid / project.paymentSnapshot.totalCost) * 100
        : 0;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'description', label: 'Brief', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { id: 'developers', label: 'Team', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { id: 'documents', label: 'Docs', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-3M8 7H6' },
        ...(isAdmin ? [{ id: 'payments', label: 'Payments', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }] : []),
        { id: 'infrastructure', label: 'Infras', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
            <div className="bg-bg-card border border-border rounded-xl shadow-sm p-4 md:p-8">
                <div className="flex items-center space-x-2 text-[10px] text-text-muted mb-6 cursor-pointer hover:text-text-primary uppercase tracking-widest font-black transition-colors" onClick={onBack}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    <span>Back to Projects</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight truncate">
                                {project.projectName}
                            </h1>
                            <span className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-wider shadow-sm ${project.status === 'LIVE' ? 'bg-achievement-muted text-achievement' :
                                project.status === 'DEVELOPMENT' ? 'bg-focus-muted text-focus' :
                                    project.status === 'PLANNING' ? 'bg-xp/10 text-xp border border-xp/20' :
                                        'bg-bg-muted text-text-secondary border border-border'
                                }`}>
                                {project.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-lg text-text-secondary font-bold flex items-center">
                            <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse"></span>
                            {project.client?.businessName || 'Individual Client'}
                        </p>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={handleLockToggle}
                            disabled={isLoading}
                            className={`w-full md:w-auto px-6 py-3 rounded-xl font-black transition-all flex items-center justify-center space-x-2 border-2 ${isLocked
                                ? 'bg-danger/10 border-danger text-danger hover:bg-danger/20'
                                : 'bg-focus/10 border-focus text-focus hover:bg-focus/20 shadow-lg shadow-focus/10'
                                }`}
                        >
                            {isLocked ? (
                                <>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                    <span className="uppercase tracking-widest text-xs">Locked</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 016 0z" /></svg>
                                    <span className="uppercase tracking-widest text-xs">Unlocked</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="flex overflow-x-auto scrollbar-hide space-x-2 mt-8 -mb-4 md:-mb-8 pt-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-t-xl transition-all whitespace-nowrap font-bold text-xs uppercase tracking-widest border-b-4 ${activeTab === tab.id
                                ? 'bg-bg-muted border-accent text-accent'
                                : 'border-transparent text-text-muted hover:text-text-primary hover:bg-bg-muted/50'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} /></svg>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-bg-card border border-border rounded-xl shadow-sm min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Project Information</h3>
                            {!isLocked && isAdmin && <button onClick={() => setIsEditModalOpen(true)} className="text-[10px] font-black uppercase text-focus hover:underline tracking-widest">Edit Details</button>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Project Type</p>
                                <p className="font-bold text-text-primary text-lg">{project.projectType}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Tech Stack</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {project.techStack?.split(',').map((tech, i) => (
                                        <span key={i} className="px-3 py-1 bg-bg-muted text-text-primary rounded-lg text-xs font-bold border border-border/50">{tech.trim()}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Start Date</p>
                                <p className="font-bold text-text-primary text-lg">{new Date(project.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Est. Delivery</p>
                                <p className="font-bold text-text-primary text-lg">{project.expectedEndDate ? new Date(project.expectedEndDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'description' && (
                    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Execution Brief</h3>
                            {!isLocked && isAdmin && <button onClick={() => setIsEditModalOpen(true)} className="text-[10px] font-black uppercase text-focus hover:underline tracking-widest">Edit Brief</button>}
                        </div>
                        <div className="prose prose-sm max-w-none text-text-secondary leading-loose font-medium bg-bg-muted/30 p-8 rounded-2xl border border-border/50">
                            {project.projectDescription || 'No detailed execution brief has been provided for this project yet.'}
                        </div>
                    </div>
                )}

                {activeTab === 'developers' && (
                    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Team Members</h3>
                            {!isLocked && isAdmin && <button onClick={() => setIsDevModalOpen(true)} className="px-4 py-2 bg-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-accent/20">+ Assign Developer</button>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.assignedDevelopers?.length > 0 ? (
                                project.assignedDevelopers.map((assignment, idx) => (
                                    <div key={idx} className="p-5 border border-border rounded-2xl bg-bg-muted/20 flex justify-between items-center group transition-all hover:border-accent hover:shadow-xl hover:shadow-accent/5">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-xp text-white flex items-center justify-center font-black text-lg shadow-lg">
                                                {assignment.developer?.name?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-text-primary text-base">{assignment.developer?.name}</p>
                                                <p className="text-[10px] text-accent font-black uppercase tracking-widest mt-0.5">{assignment.role}</p>
                                            </div>
                                        </div>
                                        {!isLocked && isAdmin && (
                                            <button onClick={() => handleRemoveDeveloper(assignment.developer?._id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-danger hover:bg-danger/10 rounded-lg">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-3xl">
                                    <p className="text-text-muted font-bold tracking-widest uppercase text-xs">No developers assigned yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Project Resources</h3>
                            {!isLocked && isAdmin && <button onClick={() => setIsDocModalOpen(true)} className="px-4 py-2 bg-xp text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-xp/20">+ Add Link</button>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.documents?.length > 0 ? (
                                project.documents.map((doc, idx) => (
                                    <a key={idx} href={doc.link} target="_blank" rel="noopener noreferrer" className="p-5 border border-border rounded-2xl flex items-center justify-between hover:bg-bg-muted transition-all group">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-xl bg-bg-muted flex items-center justify-center text-text-secondary font-black">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-black text-text-primary uppercase tracking-tight text-sm">{doc.title}</p>
                                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">{doc.type}</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-3xl">
                                    <p className="text-text-muted font-bold tracking-widest uppercase text-xs">No documents or links added yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'payments' && isAdmin && (
                    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Financial Summary</h3>
                            {!isLocked && <button onClick={() => setIsPaymentModalOpen(true)} className="px-4 py-2 bg-achievement text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-achievement/20">Record Payment</button>}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                            <div className="p-8 bg-bg-muted/50 rounded-3xl border border-border flex flex-col justify-center">
                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-2 text-center">Collection Status</p>
                                <div className="text-center">
                                    <span className="text-5xl font-black text-xp leading-none">{paymentProgress.toFixed(0)}%</span>
                                    <div className="w-full bg-border h-4 rounded-full mt-6 overflow-hidden max-w-[200px] mx-auto">
                                        <div className="h-full bg-gradient-to-r from-xp to-achievement shadow-lg" style={{ width: `${paymentProgress}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-6 bg-achievement/5 rounded-3xl border border-achievement/20 flex flex-col justify-between">
                                    <p className="text-[10px] text-achievement font-black uppercase tracking-widest mb-4">Total Budget</p>
                                    <p className="text-3xl font-black text-text-primary">₹{project.paymentSnapshot?.totalCost?.toLocaleString()}</p>
                                </div>
                                <div className="p-6 bg-focus/5 rounded-3xl border border-focus/20 flex flex-col justify-between">
                                    <p className="text-[10px] text-focus font-black uppercase tracking-widest mb-4">Amount Collected</p>
                                    <p className="text-3xl font-black text-text-primary">₹{project.paymentSnapshot?.amountPaid?.toLocaleString()}</p>
                                </div>
                                <div className="col-span-full p-8 bg-danger/5 rounded-3xl border border-danger/20 flex flex-col sm:flex-row justify-between items-center">
                                    <div className="text-center sm:text-left mb-4 sm:mb-0">
                                        <p className="text-[10px] text-danger font-black uppercase tracking-widest mb-1">Outstanding Balance</p>
                                        <p className="text-4xl font-black text-danger leading-none">₹{(project.paymentSnapshot?.totalCost - project.paymentSnapshot?.amountPaid).toLocaleString()}</p>
                                    </div>
                                    <span className="px-4 py-2 bg-danger/10 text-danger rounded-xl text-[10px] font-black uppercase tracking-widest border border-danger/20 animate-pulse">Pending Action</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'infrastructure' && (
                    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Infrastructure & Hosting</h3>
                            {!isLocked && isAdmin && <button onClick={() => setIsInfraModalOpen(true)} className="text-[10px] font-black uppercase text-focus hover:underline tracking-widest">Update Infrastructure</button>}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="p-6 bg-bg-muted/30 rounded-2xl border border-border/50">
                                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Deployment Links</h4>
                                    <div className="space-y-3">
                                        {project.deploymentLinks?.length > 0 ? (
                                            project.deploymentLinks.map((link, i) => (
                                                <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-sm font-bold text-accent hover:underline bg-white p-3 rounded-xl border border-border shadow-sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    <span className="truncate">{link}</span>
                                                </a>
                                            ))
                                        ) : (
                                            <p className="text-sm text-text-muted italic">No deployment links found.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-6 bg-bg-card rounded-2xl border border-border shadow-sm">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[10px] text-text-muted font-black uppercase mb-1">Hosting Platform</p>
                                            <p className="font-bold text-text-primary">{project.hosting?.backendHosting || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-text-muted font-black uppercase mb-1">Database</p>
                                            <p className="font-bold text-text-primary">{project.hosting?.database || 'N/A'}</p>
                                        </div>
                                        <div className="col-span-full">
                                            <p className="text-[10px] text-text-muted font-black uppercase mb-1">Domain Name</p>
                                            <p className="font-bold text-accent text-lg">{project.hosting?.domainName || 'Not configured'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isDevModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-in fade-in duration-200">
                    <div className="bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6">Assign Team Member</h3>
                        <form onSubmit={handleAddDeveloper} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Select Developer</label>
                                <select
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all"
                                    value={devForm.developerId}
                                    onChange={(e) => setDevForm({ ...devForm, developerId: e.target.value })}
                                >
                                    <option value="">Choose a developer...</option>
                                    {developers.filter(d => !project.assignedDevelopers.some(ad => ad.developer?._id === d._id)).map(dev => (
                                        <option key={dev._id} value={dev._id}>{dev.name} ({dev.specialization || 'Dev'})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Assign Role</label>
                                <select
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all"
                                    value={devForm.role}
                                    onChange={(e) => setDevForm({ ...devForm, role: e.target.value })}
                                >
                                    {["FRONTEND", "BACKEND", "FULLSTACK", "MOBILE", "DESIGNER"].map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => setIsDevModalOpen(false)} className="flex-1 px-4 py-3 border border-border rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-bg-muted transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-accent text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-accent/20">
                                    {isLoading ? 'Assigning...' : 'Assign Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDocModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-in fade-in duration-200">
                    <div className="bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6">Add Project Link</h3>
                        <form onSubmit={handleAddDocument} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Link Title</label>
                                <input
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all"
                                    placeholder="e.g. Figma Design"
                                    value={docForm.title}
                                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Resource Type</label>
                                <select
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all"
                                    value={docForm.type}
                                    onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
                                >
                                    {["FIGMA", "GITHUB", "DRIVE", "AGREEMENT", "COSTING", "INVOICE", "OTHER"].map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">URL / Link</label>
                                <input
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent transition-all"
                                    placeholder="https://..."
                                    value={docForm.link}
                                    onChange={(e) => setDocForm({ ...docForm, link: e.target.value })}
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => setIsDocModalOpen(false)} className="flex-1 px-4 py-3 border border-border rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-bg-muted transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-xp text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-xp/20">
                                    {isLoading ? 'Saving...' : 'Add Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-in fade-in duration-200">
                    <div className="bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6">Edit Project Details</h3>
                        <form onSubmit={handleUpdateProject} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-full">
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Project Name</label>
                                    <input
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        value={editForm.projectName}
                                        onChange={(e) => setEditForm({ ...editForm, projectName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Project Type</label>
                                    <select
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        value={editForm.projectType}
                                        onChange={(e) => setEditForm({ ...editForm, projectType: e.target.value })}
                                    >
                                        <option value="WEBSITE">Website</option>
                                        <option value="APP">Mobile App</option>
                                        <option value="BOTH">Website & App</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Current Status</label>
                                    <select
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    >
                                        <option value="PLANNING">Planning</option>
                                        <option value="DEVELOPMENT">Development</option>
                                        <option value="REVIEW">Review</option>
                                        <option value="LIVE">Live</option>
                                        <option value="ON_HOLD">On Hold</option>
                                    </select>
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Tech Stack (comma separated)</label>
                                    <input
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        placeholder="React, Node.js, MongoDB"
                                        value={editForm.techStack}
                                        onChange={(e) => setEditForm({ ...editForm, techStack: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        value={editForm.startDate}
                                        onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Expected Delivery</label>
                                    <input
                                        type="date"
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        value={editForm.expectedEndDate}
                                        onChange={(e) => setEditForm({ ...editForm, expectedEndDate: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Execution Brief / Description</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all resize-none"
                                        value={editForm.projectDescription}
                                        onChange={(e) => setEditForm({ ...editForm, projectDescription: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4 border-t border-border">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-3 border border-border rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-bg-muted transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-focus text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-focus/20">
                                    {isLoading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-in fade-in duration-200">
                    <div className="bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6">Record New Payment</h3>
                        <form onSubmit={handleRecordPayment} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Amount (₹)</label>
                                <input
                                    type="number"
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-achievement transition-all"
                                    placeholder="Enter amount paid..."
                                    value={paymentForm.amountPaid}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
                                />
                            </div>
                            <div className="p-4 bg-bg-muted/50 rounded-xl border border-border">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Current Outstanding</p>
                                <p className="text-xl font-black text-text-primary">₹{(project.paymentSnapshot?.totalCost - project.paymentSnapshot?.amountPaid).toLocaleString()}</p>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 px-4 py-3 border border-border rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-bg-muted transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-achievement text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-achievement/20">
                                    {isLoading ? 'Recording...' : 'Record Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isInfraModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay animate-in fade-in duration-200">
                    <div className="bg-bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6">Update Infrastructure</h3>
                        <form onSubmit={handleUpdateInfra} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Deployment Links (comma separated)</label>
                                <textarea
                                    rows={2}
                                    className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all resize-none"
                                    placeholder="https://app-dev.com, https://app-prod.com"
                                    value={infraForm.deploymentLinks}
                                    onChange={(e) => setInfraForm({ ...infraForm, deploymentLinks: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Hosting Platform</label>
                                    <input
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        placeholder="e.g. Vercel, AWS"
                                        value={infraForm.hosting.backendHosting}
                                        onChange={(e) => setInfraForm({ ...infraForm, hosting: { ...infraForm.hosting, backendHosting: e.target.value } })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Database</label>
                                    <input
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        placeholder="e.g. MongoDB Atlas"
                                        value={infraForm.hosting.database}
                                        onChange={(e) => setInfraForm({ ...infraForm, hosting: { ...infraForm.hosting, database: e.target.value } })}
                                    />
                                </div>
                                <div className="col-span-full">
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Domain Name</label>
                                    <input
                                        className="w-full bg-bg-muted border border-border rounded-xl px-4 py-3 font-bold text-text-primary outline-none focus:ring-2 focus:ring-focus transition-all"
                                        placeholder="e.g. project-awesome.com"
                                        value={infraForm.hosting.domainName}
                                        onChange={(e) => setInfraForm({ ...infraForm, hosting: { ...infraForm.hosting, domainName: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4 border-t border-border">
                                <button type="button" onClick={() => setIsInfraModalOpen(false)} className="flex-1 px-4 py-3 border border-border rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-bg-muted transition-all">Cancel</button>
                                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-focus text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-focus/20">
                                    {isLoading ? 'Updating...' : 'Save Infra Details'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectOverview;
