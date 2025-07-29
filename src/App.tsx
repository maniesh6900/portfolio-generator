import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Linkedin, Github, Globe, Twitter, Briefcase, GraduationCap, Code, Image as ImageIcon, User as UserIcon
} from 'lucide-react';

// Define Interfaces for Data Structures
interface Experience {
  title: string;
  company: string;
  dates: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  dates: string;
  description?: string; // Optional field
}

interface Project {
  name: string;
  description: string;
  technologies?: string; // Comma-separated string
  projectUrl?: string; // Optional URL
  githubUrl?: string; // Optional URL
}

interface PortfolioData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profilePicture: string;
  linkedin: string;
  github: string;
  website: string;
  twitter: string;
  skills: string[]; // Now an array of strings
  experience: Experience[];
  education: Education[];
  projects: Project[];
}

// Main App Component
const App: React.FC = () => {
  // State to store all portfolio data
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  // State to store the selected template ID
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template1'); // Default template
  // State to control visibility of the full portfolio page
  const [showFullPortfolio, setShowFullPortfolio] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = (data: PortfolioData) => {
    setPortfolioData(data);
    setShowFullPortfolio(false); // Show the profile card initially
  };

  // Handle click on the profile card to show full portfolio
  const handleCardClick = () => {
    setShowFullPortfolio(true);
  };

  // Handle back button click from full portfolio
  const handleBackToForm = () => {
    setShowFullPortfolio(false);
    setPortfolioData(null); // Clear data to show form again
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 font-inter text-gray-800 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Dynamic Portfolio Generator
      </h1>

      {showFullPortfolio && portfolioData ? (
        // Display full portfolio if showFullPortfolio is true and data exists
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-6 md:p-10 relative">
          <button
            onClick={handleBackToForm}
            className="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 shadow-md"
          >
            ← Back to Form
          </button>
          <PortfolioPage data={portfolioData} template={selectedTemplate} />
        </div>
      ) : portfolioData ? (
        // Display profile card if data exists but full portfolio is not shown
        <ProfileCard data={portfolioData} onClick={handleCardClick} onReset={() => setPortfolioData(null)} />
      ) : (
        // Display the form if no data is submitted yet
        <PortfolioForm onSubmit={handleSubmit} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
      )}
    </div>
  );
};

// Props for PortfolioForm
interface PortfolioFormProps {
  onSubmit: (data: PortfolioData) => void;
  selectedTemplate: string;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
}

// Portfolio Form Component
const PortfolioForm: React.FC<PortfolioFormProps> = ({ onSubmit, selectedTemplate, setSelectedTemplate }) => {
  // State for each form field
  const [formData, setFormData] = useState<Omit<PortfolioData, 'skills'> & { skills: string }>({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    profilePicture: '',
    linkedin: '',
    github: '',
    website: '',
    twitter: '',
    skills: '', // Comma-separated string in form, converted to array on submit
    experience: [],
    education: [],
    projects: [],
  });

  // Handle input changes for basic fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle changes for array fields (experience, education, projects)
  const handleArrayChange = (
    index: number,
    field: 'experience' | 'education' | 'projects',
    subField: keyof Experience | keyof Education | keyof Project,
    value: string
  ) => {
    setFormData((prevData) => {
      const newArray = [...prevData[field]] as (Experience | Education | Project)[];
      // Type assertion needed here because TypeScript can't infer the exact type of newArray[index]
      (newArray[index] as any) = { ...newArray[index], [subField]: value };
      return { ...prevData, [field]: newArray as any }; // Cast back to any for assignment
    });
  };

  // Add new entry for array fields
  const addEntry = (field: 'experience' | 'education' | 'projects') => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], {} as any], // Add an empty object for a new entry, cast to any
    }));
  };

  // Remove entry from array fields
  const removeEntry = (field: 'experience' | 'education' | 'projects', index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index) as any, // Filter and cast
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Parse skills string into an array
    const parsedSkills = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
    onSubmit({ ...formData, skills: parsedSkills });
  };

  // Input field helper component props
  interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
  }

  // Input field helper component
  const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', placeholder = '' }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  );

  // Textarea field helper component props
  interface TextareaFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
  }

  // Textarea field helper component
  const TextareaField: React.FC<TextareaFieldProps> = ({ label, name, value, onChange, placeholder = '' }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      ></textarea>
    </div>
  );

  return (
    <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-6 md:p-8">
      <form onSubmit={handleSubmit}>
        {/* Template Selection */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
            <UserIcon className="mr-2" size={20} /> Select Portfolio Template
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <label className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center transition-all duration-300 ${selectedTemplate === 'template1' ? 'border-blue-600 bg-blue-100 shadow-md' : 'border-gray-300 hover:border-blue-400'}`}>
              <input
                type="radio"
                name="template"
                value="template1"
                checked={selectedTemplate === 'template1'}
                onChange={() => setSelectedTemplate('template1')}
                className="hidden"
              />
              <span className="text-lg font-medium">Clean & Minimal</span>
              <div className="w-24 h-16 bg-gradient-to-br from-gray-100 to-white border border-gray-200 rounded-md mt-2 flex items-center justify-center text-gray-400 text-xs">
                Preview 1
              </div>
            </label>
            <label className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center transition-all duration-300 ${selectedTemplate === 'template2' ? 'border-blue-600 bg-blue-100 shadow-md' : 'border-gray-300 hover:border-blue-400'}`}>
              <input
                type="radio"
                name="template"
                value="template2"
                checked={selectedTemplate === 'template2'}
                onChange={() => setSelectedTemplate('template2')}
                className="hidden"
              />
              <span className="text-lg font-medium">Modern & Bold</span>
              <div className="w-24 h-16 bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300 rounded-md mt-2 flex items-center justify-center text-blue-600 text-xs">
                Preview 2
              </div>
            </label>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <UserIcon className="mr-2" size={20} /> Personal Information
          </h2>
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
          <InputField label="Professional Title" name="title" value={formData.title} onChange={handleChange} placeholder="Software Engineer" />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john.doe@example.com" />
          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+1 (123) 456-7890" />
          <InputField label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="San Francisco, CA" />
          <TextareaField label="Short Bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="A passionate developer with expertise in..." />
          <InputField label="Profile Picture URL" name="profilePicture" value={formData.profilePicture} onChange={handleChange} placeholder="https://example.com/your-photo.jpg" />
        </div>

        {/* Social Links */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Globe className="mr-2" size={20} /> Social Links
          </h2>
          <InputField label="LinkedIn Profile URL" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" />
          <InputField label="GitHub Profile URL" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/yourusername" />
          <InputField label="Personal Website URL" name="website" value={formData.website} onChange={handleChange} placeholder="https://yourwebsite.com" />
          <InputField label="Twitter Profile URL" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="https://twitter.com/yourhandle" />
        </div>

        {/* Skills */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Code className="mr-2" size={20} /> Skills
          </h2>
          <TextareaField label="Skills (comma-separated)" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, JavaScript, Node.js, Python, SQL" />
        </div>

        {/* Experience */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Briefcase className="mr-2" size={20} /> Work Experience
          </h2>
          {formData.experience.map((exp: Experience, index: number) => (
            <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md bg-white shadow-sm relative">
              <button
                type="button"
                onClick={() => removeEntry('experience', index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
                title="Remove Experience"
              >
                &times;
              </button>
              <InputField
                label="Job Title"
                name={`exp-title-${index}`}
                value={exp.title || ''}
                onChange={(e) => handleArrayChange(index, 'experience', 'title', e.target.value)}
                placeholder="Software Engineer"
              />
              <InputField
                label="Company"
                name={`exp-company-${index}`}
                value={exp.company || ''}
                onChange={(e) => handleArrayChange(index, 'experience', 'company', e.target.value)}
                placeholder="Tech Corp"
              />
              <InputField
                label="Dates (e.g., Jan 2020 - Dec 2022)"
                name={`exp-dates-${index}`}
                value={exp.dates || ''}
                onChange={(e) => handleArrayChange(index, 'experience', 'dates', e.target.value)}
                placeholder="Jan 2020 - Dec 2022"
              />
              <TextareaField
                label="Description"
                name={`exp-description-${index}`}
                value={exp.description || ''}
                onChange={(e) => handleArrayChange(index, 'experience', 'description', e.target.value)}
                placeholder="Developed and maintained..."
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEntry('experience')}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 shadow-md"
          >
            Add Experience
          </button>
        </div>

        {/* Education */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <GraduationCap className="mr-2" size={20} /> Education
          </h2>
          {formData.education.map((edu: Education, index: number) => (
            <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md bg-white shadow-sm relative">
              <button
                type="button"
                onClick={() => removeEntry('education', index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
                title="Remove Education"
              >
                &times;
              </button>
              <InputField
                label="Degree"
                name={`edu-degree-${index}`}
                value={edu.degree || ''}
                onChange={(e) => handleArrayChange(index, 'education', 'degree', e.target.value)}
                placeholder="M.Sc. Computer Science"
              />
              <InputField
                label="Institution"
                name={`edu-institution-${index}`}
                value={edu.institution || ''}
                onChange={(e) => handleArrayChange(index, 'education', 'institution', e.target.value)}
                placeholder="University of Example"
              />
              <InputField
                label="Dates (e.g., Sep 2018 - May 2020)"
                name={`edu-dates-${index}`}
                value={edu.dates || ''}
                onChange={(e) => handleArrayChange(index, 'education', 'dates', e.target.value)}
                placeholder="Sep 2018 - May 2020"
              />
              <TextareaField
                label="Description (Optional)"
                name={`edu-description-${index}`}
                value={edu.description || ''}
                onChange={(e) => handleArrayChange(index, 'education', 'description', e.target.value)}
                placeholder="Relevant coursework, achievements..."
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEntry('education')}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 shadow-md"
          >
            Add Education
          </button>
        </div>

        {/* Projects */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ImageIcon className="mr-2" size={20} /> Projects
          </h2>
          {formData.projects.map((project: Project, index: number) => (
            <div key={index} className="mb-6 p-4 border border-gray-300 rounded-md bg-white shadow-sm relative">
              <button
                type="button"
                onClick={() => removeEntry('projects', index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
                title="Remove Project"
              >
                &times;
              </button>
              <InputField
                label="Project Name"
                name={`proj-name-${index}`}
                value={project.name || ''}
                onChange={(e) => handleArrayChange(index, 'projects', 'name', e.target.value)}
                placeholder="E-commerce Platform"
              />
              <TextareaField
                label="Description"
                name={`proj-description-${index}`}
                value={project.description || ''}
                onChange={(e) => handleArrayChange(index, 'projects', 'description', e.target.value)}
                placeholder="Built a full-stack e-commerce platform..."
              />
              <InputField
                label="Technologies Used (comma-separated)"
                name={`proj-tech-${index}`}
                value={project.technologies || ''}
                onChange={(e) => handleArrayChange(index, 'projects', 'technologies', e.target.value)}
                placeholder="React, Node.js, MongoDB"
              />
              <InputField
                label="Project URL (Live Demo)"
                name={`proj-url-${index}`}
                value={project.projectUrl || ''}
                onChange={(e) => handleArrayChange(index, 'projects', 'projectUrl', e.target.value)}
                placeholder="https://live-demo.com/project"
              />
              <InputField
                label="GitHub Repository URL"
                name={`proj-github-${index}`}
                value={project.githubUrl || ''}
                onChange={(e) => handleArrayChange(index, 'projects', 'githubUrl', e.target.value)}
                placeholder="https://github.com/yourusername/project"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEntry('projects')}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 shadow-md"
          >
            Add Project
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-lg text-lg"
        >
          Generate Portfolio
        </button>
      </form>
    </div>
  );
};

// Props for ProfileCard
interface ProfileCardProps {
  data: PortfolioData;
  onClick: () => void;
  onReset: () => void;
}

// Profile Card Component
const ProfileCard: React.FC<ProfileCardProps> = ({ data, onClick, onReset }) => {
  return (
    <div
      className="w-full max-w-sm bg-white shadow-xl rounded-xl p-6 cursor-pointer hover:shadow-2xl transition-shadow duration-300 relative"
      onClick={onClick}
    >
      <button
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onReset(); }}
        className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition-colors duration-300 shadow-md"
        title="Reset Form"
      >
        Reset
      </button>
      <div className="flex flex-col items-center text-center">
        <img
          src={data.profilePicture || `https://placehold.co/120x120/E0F2F7/0288D1?text=${data.name ? data.name.charAt(0) : '?'}`}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-md mb-4"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/120x120/E0F2F7/0288D1?text=${data.name ? data.name.charAt(0) : '?'}`; }}
        />
        <h2 className="text-3xl font-bold text-gray-900 mb-1">{data.name}</h2>
        <p className="text-xl text-blue-600 font-semibold mb-3">{data.title}</p>
        <p className="text-gray-700 mb-4 text-center line-clamp-3">{data.bio}</p>

        <div className="flex gap-4 mt-2">
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition-colors">
              <Linkedin size={24} />
            </a>
          )}
          {data.github && (
            <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors">
              <Github size={24} />
            </a>
          )}
          {data.website && (
            <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 transition-colors">
              <Globe size={24} />
            </a>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-4">Click to view full portfolio</p>
      </div>
    </div>
  );
};

// Props for PortfolioPage
interface PortfolioPageProps {
  data: PortfolioData;
  template: string;
}

// Portfolio Page Component (renders chosen template)
const PortfolioPage: React.FC<PortfolioPageProps> = ({ data, template }) => {
  const TemplateComponent = template === 'template2' ? Template2 : Template1;
  return <TemplateComponent data={data} />;
};

// Props for Template Components
interface TemplateProps {
  data: PortfolioData;
}

// Template 1: Clean & Minimal
const Template1: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="p-4 md:p-8 bg-white rounded-lg shadow-lg">
      <header className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-8 pb-6 border-b border-gray-200">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">{data.name}</h1>
          <p className="text-2xl text-blue-600 font-semibold mt-2">{data.title}</p>
        </div>
        <div className="flex-shrink-0">
          <img
            src={data.profilePicture || `https://placehold.co/150x150/E0F2F7/0288D1?text=${data.name ? data.name.charAt(0) : '?'}`}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-400 shadow-lg"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/150x150/E0F2F7/0288D1?text=${data.name ? data.name.charAt(0) : '?'}`; }}
          />
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">About Me</h2>
        <p className="text-lg text-gray-700 leading-relaxed">{data.bio}</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Mail className="mr-2 text-blue-500" size={20} /> Contact
          </h3>
          <ul className="text-lg text-gray-700 space-y-2">
            {data.email && (
              <li className="flex items-center">
                <Mail className="mr-3 text-gray-600" size={18} /> {data.email}
              </li>
            )}
            {data.phone && (
              <li className="flex items-center">
                <Phone className="mr-3 text-gray-600" size={18} /> {data.phone}
              </li>
            )}
            {data.location && (
              <li className="flex items-center">
                <MapPin className="mr-3 text-gray-600" size={18} /> {data.location}
              </li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Globe className="mr-2 text-blue-500" size={20} /> Social
          </h3>
          <ul className="text-lg text-gray-700 space-y-2">
            {data.linkedin && (
              <li className="flex items-center">
                <Linkedin className="mr-3 text-blue-700" size={18} />
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  LinkedIn
                </a>
              </li>
            )}
            {data.github && (
              <li className="flex items-center">
                <Github className="mr-3 text-gray-700" size={18} />
                <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  GitHub
                </a>
              </li>
            )}
            {data.website && (
              <li className="flex items-center">
                <Globe className="mr-3 text-green-700" size={18} />
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Website
                </a>
              </li>
            )}
            {data.twitter && (
              <li className="flex items-center">
                <Twitter className="mr-3 text-blue-400" size={18} />
                <a href={data.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Twitter
                </a>
              </li>
            )}
          </ul>
        </div>
      </section>

      {data.skills && data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-md font-medium shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">{exp.title} at {exp.company}</h3>
                <p className="text-blue-600 text-sm mb-2">{exp.dates}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">Education</h2>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">{edu.degree} from {edu.institution}</h3>
                <p className="text-blue-600 text-sm mb-2">{edu.dates}</p>
                {edu.description && <p className="text-gray-700">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.projects.map((project, index) => (
              <div key={index} className="p-5 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-700 mb-3">{project.description}</p>
                {project.technologies && (
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Technologies:</span> {project.technologies}
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors shadow-sm"
                    >
                      <Globe className="mr-2" size={16} /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      <Github className="mr-2" size={16} /> GitHub Repo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// Template 2: Modern & Bold
const Template2: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-lg shadow-2xl">
      <header className="text-center mb-10">
        <img
          src={data.profilePicture || `https://placehold.co/180x180/0288D1/FFFFFF?text=${data.name ? data.name.charAt(0) : '?'}`}
          alt="Profile"
          className="w-48 h-48 rounded-full object-cover border-4 border-blue-300 shadow-xl mx-auto mb-6"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/180x180/0288D1/FFFFFF?text=${data.name ? data.name.charAt(0) : '?'}`; }}
        />
        <h1 className="text-6xl font-extrabold tracking-tight text-blue-100 leading-none">{data.name}</h1>
        <p className="text-3xl text-blue-300 font-light mt-3">{data.title}</p>
        <div className="flex justify-center gap-6 mt-6 text-blue-200">
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Linkedin size={32} />
            </a>
          )}
          {data.github && (
            <a href={data.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Github size={32} />
            </a>
          )}
          {data.website && (
            <a href={data.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Globe size={32} />
            </a>
          )}
          {data.twitter && (
            <a href={data.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Twitter size={32} />
            </a>
          )}
        </div>
      </header>

      <section className="mb-10 p-6 bg-blue-800 bg-opacity-50 rounded-xl shadow-inner">
        <h2 className="text-3xl font-bold text-blue-200 mb-4 border-b-2 border-blue-400 pb-2">About Me</h2>
        <p className="text-lg text-blue-100 leading-relaxed">{data.bio}</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-2xl font-bold text-blue-200 mb-4 flex items-center">
            <Mail className="mr-3 text-blue-300" size={24} /> Contact
          </h3>
          <ul className="text-lg text-blue-100 space-y-3">
            {data.email && (
              <li className="flex items-center">
                <Mail className="mr-3 text-blue-300" size={20} /> {data.email}
              </li>
            )}
            {data.phone && (
              <li className="flex items-center">
                <Phone className="mr-3 text-blue-300" size={20} /> {data.phone}
              </li>
            )}
            {data.location && (
              <li className="flex items-center">
                <MapPin className="mr-3 text-blue-300" size={20} /> {data.location}
              </li>
            )}
          </ul>
        </div>
        {data.skills && data.skills.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-blue-200 mb-4 flex items-center">
              <Code className="mr-3 text-blue-300" size={24} /> Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <span key={index} className="bg-blue-600 text-blue-100 px-5 py-2 rounded-full text-md font-medium shadow-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {data.experience && data.experience.length > 0 && (
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-blue-200 mb-6 border-b-2 border-blue-400 pb-2">Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="p-6 bg-blue-800 bg-opacity-50 rounded-xl shadow-lg border border-blue-700">
                <h3 className="text-2xl font-semibold text-blue-100 mb-1">{exp.title}</h3>
                <p className="text-blue-300 text-lg mb-2">{exp.company}</p>
                <p className="text-blue-400 text-sm mb-3">{exp.dates}</p>
                <p className="text-blue-100 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-blue-200 mb-6 border-b-2 border-blue-400 pb-2">Education</h2>
          <div className="space-y-8">
            {data.education.map((edu, index) => (
              <div key={index} className="p-6 bg-blue-800 bg-opacity-50 rounded-xl shadow-lg border border-blue-700">
                <h3 className="text-2xl font-semibold text-blue-100 mb-1">{edu.degree}</h3>
                <p className="text-blue-300 text-lg mb-2">{edu.institution}</p>
                <p className="text-blue-400 text-sm mb-3">{edu.dates}</p>
                {edu.description && <p className="text-blue-100 leading-relaxed">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-blue-200 mb-6 border-b-2 border-blue-400 pb-2">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.projects.map((project, index) => (
              <div key={index} className="p-6 bg-blue-800 bg-opacity-50 rounded-xl shadow-lg border border-blue-700">
                <h3 className="text-2xl font-semibold text-blue-100 mb-2">{project.name}</h3>
                <p className="text-blue-100 mb-3">{project.description}</p>
                {project.technologies && (
                  <p className="text-sm text-blue-300 mb-3">
                    <span className="font-medium">Technologies:</span> {project.technologies}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-4">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2 bg-blue-500 text-white text-md font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                    >
                      <Globe className="mr-2" size={18} /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2 bg-gray-700 text-white text-md font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md"
                    >
                      <Github className="mr-2" size={18} /> GitHub Repo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// Inject Tailwind CSS script and Font
const injectScripts = () => {
  const tailwindScript = document.createElement('script');
  tailwindScript.src = 'https://cdn.tailwindcss.com';
  document.head.appendChild(tailwindScript);

  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  // Add custom Tailwind config to use 'Inter' font

}
// Call injectScripts when the component mounts
injectScripts();

export default App;
