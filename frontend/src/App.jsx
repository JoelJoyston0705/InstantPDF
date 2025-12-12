import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FileText, FileSpreadsheet, Image as ImageIcon, Heart, Shield, Zap, Presentation, Code, ArrowRight } from 'lucide-react';
import Navbar from './components/Navbar';
import ToolPage from './components/ToolPage';

import CookieConsent from './components/CookieConsent';

import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

function Home() {
  const tools = [
    {
      title: 'Word to PDF',
      description: 'Transform DOC and DOCX files into beautifully formatted PDFs.',
      icon: FileText,
      path: '/word-to-pdf',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Excel to PDF',
      description: 'Convert spreadsheets to professional PDF documents.',
      icon: FileSpreadsheet,
      path: '/excel-to-pdf',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'PowerPoint to PDF',
      description: 'Transform presentations into shareable PDF files.',
      icon: Presentation,
      path: '/ppt-to-pdf',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Image to PDF',
      description: 'Turn your images into polished PDF files instantly.',
      icon: ImageIcon,
      path: '/image-to-pdf',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'HTML to PDF',
      description: 'Convert HTML pages to professional PDF documents.',
      icon: Code,
      path: '/html-to-pdf',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      title: 'PDF to Word',
      description: 'Extract content from PDF to editable Word documents.',
      icon: ArrowRight,
      path: '/pdf-to-word',
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'PDF to Excel',
      description: 'Convert PDF tables into Excel spreadsheets.',
      icon: FileSpreadsheet,
      path: '/pdf-to-excel',
      gradient: 'from-teal-500 to-teal-600'
    },
    {
      title: 'PDF to JPG',
      description: 'Transform PDF pages into high-quality images.',
      icon: ImageIcon,
      path: '/pdf-to-jpg',
      gradient: 'from-red-500 to-rose-600'
    },
    {
      title: 'PDF to PowerPoint',
      description: 'Convert PDF slides back to editable presentations.',
      icon: Presentation,
      path: '/pdf-to-ppt',
      gradient: 'from-yellow-500 to-amber-600'
    }
  ];

  return (
    <div className="min-h-screen page-transition">
      {/* Hero Section - Apple Style */}
      <div className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-50/30 to-transparent pointer-events-none"></div>


        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="mb-6">
              Premium PDF Tools.<br />Completely Free.
            </h1>
            <p className="subtitle mb-12 max-w-3xl mx-auto">
              Transform, convert, and manage your documents with InstantPDF.
              Fast, secure, and completely free.
            </p>
            <a href="#tools" className="btn-primary inline-block">
              Explore Tools
            </a>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div id="tools" className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <Link
              to={tool.path}
              key={tool.path}
              className="tool-card animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white icon-container shadow-lg`}>
                <tool.icon size={32} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-semibold" style={{ letterSpacing: '-0.022em' }}>
                {tool.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-6 py-32 text-center max-w-6xl">
        <h2 className="text-5xl font-bold mb-6" style={{ letterSpacing: '-0.022em' }}>
          Why InstantPDF?
        </h2>
        <p className="subtitle mb-20 max-w-2xl mx-auto">
          Built for speed, security, and simplicity.
        </p>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-xl">
              <Heart size={36} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-semibold mb-4" style={{ letterSpacing: '-0.022em' }}>
              100% Free
            </h3>
            <p className="text-gray-500 leading-relaxed">
              No hidden fees, no subscriptions. All features available to everyone, always free.
            </p>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white shadow-xl">
              <Zap size={36} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-semibold mb-4" style={{ letterSpacing: '-0.022em' }}>
              Lightning Fast
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Powered by advanced algorithms to convert your documents in seconds, not minutes.
            </p>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-xl">
              <Shield size={36} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-semibold mb-4" style={{ letterSpacing: '-0.022em' }}>
              Secure & Private
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Your files are automatically deleted after processing. We never store or share your data.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-semibold mb-6 animate-fade-in-up" style={{ letterSpacing: '-0.022em' }}>
            About InstantPDF
          </h2>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <p>
              InstantPDF is a modern, free, and secure platform for all your PDF conversion and editing needs.
              Built with cutting-edge technology and designed with Apple's minimalist philosophy in mind.
            </p>
            <p>
              We believe document conversion should be fast, simple, and accessible to everyone.
              That's why we've created a comprehensive suite of 14 professional tools, all completely free.
            </p>
            <p>
              Your privacy is our priority. All files are automatically deleted from our servers immediately after processing,
              and we never store, analyze, or share your data with third parties.
            </p>
            <div className="pt-8">
              <a href="#tools" className="btn-primary inline-block">
                Try All Tools
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">© 2024 InstantPDF. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/word-to-pdf"
            element={
              <ToolPage
                title="Word to PDF"
                description="Make DOC and DOCX files easy to read by converting them to PDF."
                endpoint="/convert/docx"
                accept=".docx"
                icon={FileText}
              />
            }
          />
          <Route
            path="/excel-to-pdf"
            element={
              <ToolPage
                title="Excel to PDF"
                description="Make EXCEL spreadsheets easy to read by converting them to PDF."
                endpoint="/convert/xlsx"
                accept=".xlsx"
                icon={FileSpreadsheet}
              />
            }
          />
          <Route
            path="/image-to-pdf"
            element={
              <ToolPage
                title="Image to PDF"
                description="Convert JPG and PNG images to PDF files."
                endpoint="/convert/image"
                accept=".jpg,.jpeg,.png"
                icon={ImageIcon}
              />
            }
          />
          <Route
            path="/ppt-to-pdf"
            element={
              <ToolPage
                title="PowerPoint to PDF"
                description="Transform presentations into shareable PDF files."
                endpoint="/convert/pptx"
                accept=".pptx,.ppt"
                icon={Presentation}
              />
            }
          />
          <Route
            path="/html-to-pdf"
            element={
              <ToolPage
                title="HTML to PDF"
                description="Convert HTML pages to professional PDF documents."
                endpoint="/convert/html"
                accept=".html"
                icon={Code}
              />
            }
          />
          <Route
            path="/pdf-to-word"
            element={
              <ToolPage
                title="PDF to Word"
                description="Extract content from PDF to editable Word documents."
                endpoint="/convert/pdf-to-word"
                accept=".pdf"
                icon={ArrowRight}
              />
            }
          />
          <Route
            path="/pdf-to-excel"
            element={
              <ToolPage
                title="PDF to Excel"
                description="Convert PDF tables into Excel spreadsheets."
                endpoint="/convert/pdf-to-excel"
                accept=".pdf"
                icon={FileSpreadsheet}
              />
            }
          />
          <Route
            path="/pdf-to-jpg"
            element={
              <ToolPage
                title="PDF to JPG"
                description="Transform PDF pages into high-quality images."
                endpoint="/convert/pdf-to-jpg"
                accept=".pdf"
                icon={ImageIcon}
              />
            }
          />
          <Route
            path="/pdf-to-ppt"
            element={
              <ToolPage
                title="PDF to PowerPoint"
                description="Convert PDF slides back to editable presentations."
                endpoint="/convert/pdf-to-pptx"
                accept=".pdf"
                icon={Presentation}
              />
            }
          />



          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

        </Routes>
        <CookieConsent />
      </div>
    </Router>
  );
}

export default App;
