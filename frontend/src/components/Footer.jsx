import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="container mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/logo.png" alt="InstantPDF" className="w-10 h-10" />
                            <span className="text-xl font-semibold">InstantPDF</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Fast, secure, and free document conversion. Transform your files instantly.
                        </p>
                    </div>

                    {/* Tools */}
                    <div>
                        <h3 className="font-semibold mb-4">Tools</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/word-to-pdf" className="hover:text-gray-900">Word to PDF</Link></li>
                            <li><Link to="/excel-to-pdf" className="hover:text-gray-900">Excel to PDF</Link></li>
                            <li><Link to="/image-to-pdf" className="hover:text-gray-900">Image to PDF</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#about" className="hover:text-gray-900">About Us</a></li>
                            <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                            <li><a href="mailto:support@instantpdf.com" className="hover:text-gray-900">Contact</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/privacy" target="_blank" className="hover:text-gray-900">Privacy Policy</a></li>
                            <li><a href="/terms" target="_blank" className="hover:text-gray-900">Terms of Service</a></li>
                            <li><a href="mailto:privacy@instantpdf.com" className="hover:text-gray-900">GDPR Requests</a></li>
                            <li><a href="mailto:dpo@instantpdf.com" className="hover:text-gray-900">Data Protection</a></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} InstantPDF. All rights reserved.
                        </p>

                        {/* Compliance Badges */}
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                GDPR Compliant
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                CCPA Compliant
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                SSL Secure
                            </span>
                        </div>
                    </div>

                    {/* Data Protection Notice */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
                        <p className="mb-2">
                            <strong>Your Privacy Matters:</strong> We encrypt all data, delete files immediately after conversion, and never sell your information.
                            Files are stored temporarily and automatically deleted within 1 hour.
                        </p>
                        <p>
                            <strong>Your Rights:</strong> You can request, modify, or delete your data anytime.
                            Email <a href="mailto:privacy@instantpdf.com" className="text-blue-600 hover:underline">privacy@instantpdf.com</a> for data requests.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
