PUSHD %~dp0
set BUILDDIR=%CD%\..\skills-matrix-build
if NOT EXIST "%BUILDDIR%" mkdir "%BUILDDIR%"

meteor build --architecture os.windows.x86_32 "%BUILDDIR%"

popd
