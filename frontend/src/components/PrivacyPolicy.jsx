import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                {/* Header */}
                <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-gray-600 mb-8">Last updated: December 11, 2025</p>

                {/* Content */}
                <div className="prose prose-lg max-w-none space-y-6">
                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Our Commitment to Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            At InstantPDF, we take your privacy seriously. This policy describes how we collect,
                            use, and protect your information when you use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Information We Collect</h2>
                        <h3 className="text-2xl font-semibold mb-2">Files You Upload</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            When you upload files for conversion, we temporarily process them on our servers.
                            These files are automatically deleted within 24 hours after processing.
                        </p>

                        <h3 className="text-2xl font-semibold mb-2">Usage Data</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We collect basic analytics about how you use our service (e.g., which tools you use,
                            conversion success rates) to improve our service. This data is anonymized and does
                            not identify you personally.
                        </p>

                        <h3 className="text-2xl font-semibold mb-2">Cookies</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We use essential cookies for authentication and service functionality. Optional
                            cookies help us improve our service. You can decline optional cookies at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>To provide and maintain our PDF conversion services</li>
                            <li>To improve and optimize our service</li>
                            <li>To communicate with you about service updates</li>
                            <li>To detect and prevent fraud or abuse</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Data Security</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                            <li>All file uploads use HTTPS encryption</li>
                            <li>Files are processed in isolated environments</li>
                            <li>Automatic file deletion after 24 hours</li>
                            <li>Regular security audits and updates</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Data Sharing</h2>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>We do NOT sell your data.</strong> We only share information in these limited cases:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                            <li>When required by law or legal process</li>
                            <li>To protect our rights or the safety of others</li>
                            <li>With service providers who help us operate (under strict confidentiality agreements)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Your Rights</h2>
                        <p className="text-gray-700 leading-relaxed mb-2">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Access your personal data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of optional cookies</li>
                            <li>Export your data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Children's Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our service is not directed to children under 13. We do not knowingly collect
                            information from children under 13.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Changes to This Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this policy from time to time. We will notify you of significant
                            changes by posting a notice on our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at:{' '}
                            <a href="mailto:privacy@instantpdf.com" className="text-blue-600 hover:underline">
                                privacy@instantpdf.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
