from distutils.core import setup

setup(
    name='mongo_logviewer',
    version="0.0.1",
    url='https://github.com/sallyruthstruik/logviewer',
    license='BSD',
    description='Web APIs for Flask, made easy, inspired from Django DRF.',
    long_description=read_md('README.md'),
    author='Stas Kaledin',
    author_email='staskaledin@gmail.com',
    packages=get_packages('flask_restframework'),
    package_data=get_package_data('flask_restframework'),
    install_requires=[],
    zip_safe=False,
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Flask',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Topic :: Internet :: WWW/HTTP',
    ]
)
