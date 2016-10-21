use std::env;
use std::process::Command;

fn main() {
    use std::os::unix::process::CommandExt;
    let mut command = Command::new("/usr/sbin/networksetup");

    let mut args = env::args();
    args.next();

    let param = args.next().unwrap();
    if param == "-setwebproxy" {
    } else if param == "-setsecurewebproxy" {
    } else if param == "-setwebproxystate" {
    } else if param == "-setsecurewebproxystate" {
    } else {
        panic!("Unknown parameter: {}", param);
    }
//    match param {
//        "-setwebproxy" | "-setsecurewebproxy" | "-setwebproxystate" | "-setsecurewebproxystate" => "",
//        _ => panic!("Unknown parameter: {}", param),
//    }
    command.arg(param);
    for arg in args {
        command.arg(arg);
    }

    command.uid(0);
    let output = match command.output() {
        Ok(p) => p,
        Err(e) => panic!("Failed to execute: {}", e),
    };

    print!("{}", String::from_utf8_lossy(output.stdout.as_slice()));
}
