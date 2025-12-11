import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                {/* Header */}
                <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
                <p className="text-gray-600 mb-8">Last updated: December 11, 2025</p>

                {/* Content */}
                <div className="prose prose-lg max-w-none space-y-6">
                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Agreement to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            By accessing and using InstantPDF, you agree to be bound by these Terms of Service
                            and all applicable laws and regulations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Use of Service</h2>
                        <h3 className="text-2xl font-semibold mb-2">Permitted Use</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            InstantPDF is provided for legitimate PDF conversion and editing purposes. You may use
                            our service to convert, edit, and manage your documents.
                        </p>

                        <h3 className="text-2xl font-semibold mb-2">Prohibited Activities</h3>
                        <p className="text-gray-700 leading-relaxed mb-2">You agree NOT to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Upload illegal, harmful, or copyrighted content without authorization</li>
                            <li>Attempt to hack, abuse, or overload our systems</li>
                            <li>Use automated tools to scrape or abuse our service</li>
                            <li>Resell or redistribute our service without permission</li>
                            <li>Upload malware, viruses, or malicious code</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">File Ownership & Copyright</h2>
                        <p className="text-gray-700 leading-relaxed">
                            You retain all rights to files you upload. By uploading files, you confirm you have
                            the legal right to process these files and grant us permission to process them for
                            the conversion/editing services you request.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Service Availability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We strive to provide continuous service but do not guarantee 100% uptime. We may
                            temporarily suspend service for maintenance, updates, or technical issues.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            InstantPDF is provided "as is" without warranties. We are not liable for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                            <li>Loss of data or files</li>
                            <li>Conversion errors or quality issues</li>
                            <li>Service interruptions or downtime</li>
                            <li>Any damages arising from use of our service</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            <strong>Always keep backups of important files.</strong>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Data Processing & Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Files uploaded are processed temporarily and automatically deleted within 24 hours.
                            See our <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> for
                            details on data handling.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Free Service</h2>
                        <p className="text-gray-700 leading-relaxed">
                            InstantPDF is currently free to use. We reserve the right to introduce premium
                            features or pricing in the future, with advance notice to users.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Termination</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to terminate or suspend access to our service for violations
                            of these terms or for any reason, with or without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Changes to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may modify these terms at any time. Continued use of the service after changes
                            constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Governing Law</h2>
                        <p className="text-gray-700 leading-relaxed">
                            These terms are governed by applicable laws. Any disputes will be resolved in
                            accordance with these laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Contact</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Questions about these Terms? Contact us at:{' '}
                            <a href="mailto:legal@instantpdf.com" className="text-blue-600 hover:underline">
                                legal@instantpdf.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
