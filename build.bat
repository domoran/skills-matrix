PUSHD %~dp0
set BUILDDIR=%CD%\..\skills-matrix-build
RD /Q /S "%BUILDDIR%"
if NOT EXIST "%BUILDDIR%" mkdir "%BUILDDIR%"

call meteor build --architecture os.windows.x86_32 "%BUILDDIR%"

popd

pushd %BUILDDIR%

tar xvf skills-matrix.tar.gz

cd bundle\programs\server

call npm install

popd 

pushd %BUILDDIR%

tar -czf skill-matrix-winx86.tar.gz bundle

popd 
